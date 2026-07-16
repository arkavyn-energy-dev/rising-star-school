const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");
const SiteSettings = require("../models/SiteSettings");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const sendWhatsApp = require("../utils/sendWhatsApp");
const sendSMS = require("../utils/sendSMS");
const generateReferenceId = require("../utils/generateReferenceId");
const {
  buildTestSubmissionMessages,
  buildTestSelectionMessages,
  buildTestRejectionMessages,
} = require("../utils/schoolMessageHelpers");
const { buildDeliveryReport, getNotificationConfig } = require("../utils/notificationStatus");

const wrapCustomMessageHtml = (message, settings) => {
  const schoolName = settings?.schoolName || "Rising Star Public School";
  const body = message.replace(/\n/g, "<br/>");
  return `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:560px;line-height:1.7">
      ${body}
      <p style="margin-top:24px;color:#666">— ${schoolName}</p>
    </div>
  `;
};

// @desc    Submit a student's answers for a test — auto-scored server-side
// @route   POST /api/tests/:id/attempts
// @access  Public
const submitTestAttempt = asyncHandler(async (req, res) => {
  const test = await Test.findOne({ _id: req.params.id, isActive: true });

  if (!test) {
    res.status(404);
    throw new Error("Test not found or no longer active");
  }

  const { studentName, studentClass, parentName, email, phone, answers } = req.body;

  const score = test.questions.reduce(
    (total, question, i) => (answers[i] === question.correctOptionIndex ? total + 1 : total),
    0
  );

  let attempt;
  for (let tries = 0; tries < 3 && !attempt; tries++) {
    try {
      attempt = await TestAttempt.create({
        referenceId: generateReferenceId("RST"),
        test: test._id,
        testTitle: test.title,
        studentName,
        studentClass,
        parentName,
        email,
        phone,
        answers,
        score,
        totalQuestions: test.questions.length,
      });
    } catch (error) {
      if (error.code !== 11000 || tries === 2) throw error;
    }
  }

  const settings = await SiteSettings.getSingleton();
  const schoolName = settings.schoolName || "Rising Star Public School";

  sendEmail({
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: `New Online Test Submission — ${studentName} (${studentClass})`,
    html: `
      <h2>New Online Assessment Submission</h2>
      <p><strong>Reference ID:</strong> ${attempt.referenceId}</p>
      <p><strong>Test:</strong> ${test.title}</p>
      <p><strong>Student Name:</strong> ${studentName}</p>
      <p><strong>Class:</strong> ${studentClass}</p>
      <p><strong>Parent Name:</strong> ${parentName || "-"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Score:</strong> ${score} / ${test.questions.length}</p>
      <p>Review this submission in the admin panel to shortlist the student for admission.</p>
    `,
  });

  const studentNotify = buildTestSubmissionMessages({
    settings,
    studentName,
    testTitle: test.title,
    referenceId: attempt.referenceId,
    score,
    totalQuestions: test.questions.length,
  });

  sendEmail({
    to: email,
    subject: studentNotify.subject,
    html: studentNotify.html,
  });
  await sendWhatsApp({ to: phone, message: studentNotify.text });
  sendSMS({ to: phone, message: studentNotify.text });

  res.status(201).json({
    success: true,
    message: "Your test has been submitted successfully. A confirmation has been sent to your email and phone. Please wait for the selection result.",
    data: {
      referenceId: attempt.referenceId,
      score,
      totalQuestions: test.questions.length,
    },
  });
});

// @desc    Get all test attempts (optionally filtered by test/status)
// @route   GET /api/test-attempts
// @access  Private/Admin
const getTestAttempts = asyncHandler(async (req, res) => {
  const { test, status } = req.query;
  const filter = {};
  if (test) filter.test = test;
  if (status) filter.status = status;

  const attempts = await TestAttempt.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: attempts.length, data: attempts });
});

// @desc    Update a test attempt's selection status — notifies the student
//          by email/SMS/WhatsApp when selected or rejected
// @route   PATCH /api/test-attempts/:id
// @access  Private/Admin
const updateTestAttemptStatus = asyncHandler(async (req, res) => {
  const attempt = await TestAttempt.findById(req.params.id);

  if (!attempt) {
    res.status(404);
    throw new Error("Test attempt not found");
  }

  const previousStatus = attempt.status;
  attempt.status = req.body.status ?? attempt.status;

  let emailResult;
  let whatsappResult;

  if (attempt.status !== previousStatus && attempt.status !== "pending") {
    const settings = await SiteSettings.getSingleton();

    if (attempt.status === "selected") {
      const selected = buildTestSelectionMessages({ settings, attempt });

      emailResult = await sendEmail({
        to: attempt.email,
        subject: selected.subject,
        html: selected.html,
      });
      whatsappResult = await sendWhatsApp({ to: attempt.phone, message: selected.text });
      sendSMS({ to: attempt.phone, message: selected.text });
    } else if (attempt.status === "rejected") {
      const rejected = buildTestRejectionMessages({ settings, attempt });

      emailResult = await sendEmail({
        to: attempt.email,
        subject: rejected.subject,
        html: rejected.html,
      });
      whatsappResult = await sendWhatsApp({ to: attempt.phone, message: rejected.text });
      sendSMS({ to: attempt.phone, message: rejected.text });
    }

    attempt.notifiedAt = new Date();
  }

  await attempt.save();

  const delivery =
    attempt.status !== previousStatus && attempt.status !== "pending"
      ? buildDeliveryReport({ emailResult, whatsappResult })
      : null;

  res.status(200).json({ success: true, data: attempt, delivery });
});

// @desc    Send a custom message from admin to the student (email + WhatsApp/SMS)
// @route   POST /api/test-attempts/:id/message
// @access  Private/Admin
const sendTestAttemptMessage = asyncHandler(async (req, res) => {
  const attempt = await TestAttempt.findById(req.params.id);

  if (!attempt) {
    res.status(404);
    throw new Error("Test attempt not found");
  }

  const { message, subject } = req.body;
  const sendEmailFlag = req.body.sendEmail !== false;
  const sendWhatsAppFlag = req.body.sendWhatsApp !== false;

  const settings = await SiteSettings.getSingleton();
  const schoolName = settings.schoolName || "Rising Star Public School";
  const emailSubject = subject?.trim() || `Message from ${schoolName}`;

  let emailResult;
  let whatsappResult;

  if (sendEmailFlag) {
    emailResult = await sendEmail({
      to: attempt.email,
      subject: emailSubject,
      html: wrapCustomMessageHtml(message, settings),
      text: message,
    });
  }

  if (sendWhatsAppFlag) {
    whatsappResult = await sendWhatsApp({ to: attempt.phone, message });
    sendSMS({ to: attempt.phone, message });
  }

  attempt.notifiedAt = new Date();
  await attempt.save();

  const delivery = buildDeliveryReport({
    emailResult: sendEmailFlag ? emailResult : undefined,
    whatsappResult: sendWhatsAppFlag ? whatsappResult : undefined,
  });

  res.status(200).json({
    success: true,
    message: delivery.allConfigured
      ? "Message sent to the student's email and phone."
      : "Some channels failed — see delivery details.",
    data: attempt,
    delivery,
  });
});

// @desc    Check whether email/WhatsApp credentials are configured on the server
// @route   GET /api/test-attempts/notify-config
// @access  Private/Admin
const getTestNotifyConfig = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: getNotificationConfig() });
});

// @desc    Delete a test attempt
// @route   DELETE /api/test-attempts/:id
// @access  Private/Admin
const deleteTestAttempt = asyncHandler(async (req, res) => {
  const attempt = await TestAttempt.findById(req.params.id);

  if (!attempt) {
    res.status(404);
    throw new Error("Test attempt not found");
  }

  await attempt.deleteOne();
  res.status(200).json({ success: true, message: "Test attempt removed" });
});

module.exports = {
  submitTestAttempt,
  getTestAttempts,
  updateTestAttemptStatus,
  sendTestAttemptMessage,
  getTestNotifyConfig,
  deleteTestAttempt,
};

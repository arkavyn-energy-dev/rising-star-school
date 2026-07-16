const JobApplication = require("../models/JobApplication");
const SiteSettings = require("../models/SiteSettings");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const sendWhatsApp = require("../utils/sendWhatsApp");
const sendSMS = require("../utils/sendSMS");
const generateReferenceId = require("../utils/generateReferenceId");

// @desc    Submit a teaching job application
// @route   POST /api/careers
// @access  Public
const createJobApplication = asyncHandler(async (req, res) => {
  const { fullName, email, phone, subjectSpecialization, qualification, experienceYears, message } = req.body;

  let application;
  for (let attempt = 0; attempt < 3 && !application; attempt++) {
    try {
      application = await JobApplication.create({
        referenceId: generateReferenceId("RSJ"),
        fullName,
        email,
        phone,
        subjectSpecialization,
        qualification,
        experienceYears,
        message,
      });
    } catch (error) {
      if (error.code !== 11000 || attempt === 2) throw error;
    }
  }

  const settings = await SiteSettings.getSingleton();
  const schoolName = settings.schoolName || "Rising Star Public School";

  sendEmail({
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: `New Teaching Application — ${fullName} (${subjectSpecialization})`,
    html: `
      <h2>New Teaching Job Application</h2>
      <p><strong>Reference ID:</strong> ${application.referenceId}</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject Specialization:</strong> ${subjectSpecialization}</p>
      <p><strong>Qualification:</strong> ${qualification}</p>
      <p><strong>Experience:</strong> ${experienceYears || 0} years</p>
      <p><strong>Message:</strong> ${message || "-"}</p>
    `,
  });

  sendEmail({
    to: email,
    subject: `Application received — ${schoolName}`,
    html: `
      <h2>Thank You, ${fullName}!</h2>
      <p>We've received your teaching application for <strong>${subjectSpecialization}</strong>.</p>
      <p>Your reference ID is <strong>${application.referenceId}</strong> — please keep it for your records.</p>
      <p>Our HR team will review your profile and connect with you soon.</p>
      <p>— ${schoolName}</p>
    `,
  });

  const contactLine = settings.phone ? ` Call: ${settings.phone}.` : "";
  const addressLine = settings.address ? ` ${settings.address}.` : "";
  const text = `Thank you ${fullName}! Your teaching application (${subjectSpecialization}) has been received at ${schoolName}.${addressLine} Reference ID: ${application.referenceId}.${contactLine} Our HR team will connect with you soon.`;
  sendWhatsApp({ to: phone, message: text });
  sendSMS({ to: phone, message: text });

  res.status(201).json({
    success: true,
    message: "Your application has been submitted. Our HR team will connect with you soon.",
    data: application,
  });
});

// @desc    Get all job applications
// @route   GET /api/careers
// @access  Private/Admin
const getJobApplications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const applications = await JobApplication.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: applications.length, data: applications });
});

// @desc    Update a job application's status
// @route   PATCH /api/careers/:id
// @access  Private/Admin
const updateJobApplicationStatus = asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const previousStatus = application.status;
  application.status = req.body.status ?? application.status;

  if (application.status !== previousStatus && application.status !== "new") {
    const settings = await SiteSettings.getSingleton();
    const schoolName = settings.schoolName || "Rising Star Public School";
    const schoolPhone = settings.phone || "";

    if (application.status === "shortlisted") {
      const message = `Congratulations ${application.fullName}! Your teaching application for ${application.subjectSpecialization} at ${schoolName} has been shortlisted. Our HR team will call you at ${application.phone} shortly for the next steps.${schoolPhone ? ` School contact: ${schoolPhone}.` : ""}`;

      sendEmail({
        to: application.email,
        subject: `You're shortlisted — ${schoolName}`,
        html: `
          <h2>Congratulations, ${application.fullName}!</h2>
          <p>Your teaching application for <strong>${application.subjectSpecialization}</strong> has been <strong>shortlisted</strong>.</p>
          <p>Our HR team will call you at <strong>${application.phone}</strong> shortly for the next steps.</p>
          <p>Reference ID: <strong>${application.referenceId}</strong></p>
          <p>— ${schoolName}</p>
        `,
      });
      sendWhatsApp({ to: application.phone, message });
      sendSMS({ to: application.phone, message });
    } else if (application.status === "rejected") {
      sendEmail({
        to: application.email,
        subject: `Update on your application — ${schoolName}`,
        html: `
          <h2>Dear ${application.fullName},</h2>
          <p>Thank you for applying to teach <strong>${application.subjectSpecialization}</strong> at ${schoolName}.</p>
          <p>After review, we are unable to move forward with your application at this time. We encourage you to apply again in the future.</p>
          <p>— ${schoolName}</p>
        `,
      });
    } else if (application.status === "hired") {
      const message = `Congratulations ${application.fullName}! You have been selected to join ${schoolName} as a ${application.subjectSpecialization} teacher. Please visit the school to complete joining formalities.${schoolPhone ? ` Contact: ${schoolPhone}.` : ""}`;

      sendEmail({
        to: application.email,
        subject: `Welcome aboard — ${schoolName}`,
        html: `
          <h2>Welcome aboard, ${application.fullName}!</h2>
          <p>We are delighted to inform you that you have been <strong>selected</strong> to join ${schoolName} as a <strong>${application.subjectSpecialization}</strong> teacher.</p>
          <p>Please visit the school at your earliest convenience to complete the joining formalities.${schoolPhone ? ` You can reach us at ${schoolPhone}.` : ""}</p>
          <p>— ${schoolName}</p>
        `,
      });
      sendWhatsApp({ to: application.phone, message });
      sendSMS({ to: application.phone, message });
    }
  }

  await application.save();

  res.status(200).json({ success: true, data: application });
});

// @desc    Delete a job application
// @route   DELETE /api/careers/:id
// @access  Private/Admin
const deleteJobApplication = asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  await application.deleteOne();
  res.status(200).json({ success: true, message: "Application removed" });
});

module.exports = {
  createJobApplication,
  getJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
};

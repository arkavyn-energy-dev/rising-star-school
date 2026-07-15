const AdmissionEnquiry = require("../models/AdmissionEnquiry");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const sendWhatsApp = require("../utils/sendWhatsApp");
const sendSMS = require("../utils/sendSMS");
const generateReferenceId = require("../utils/generateReferenceId");
const SiteSettings = require("../models/SiteSettings");

// @desc    Submit an admission enquiry
// @route   POST /api/admissions
// @access  Public
const createAdmissionEnquiry = asyncHandler(async (req, res) => {
  const { parentName, studentName, email, phone, grade, message } = req.body;

  let enquiry;
  // Retry once on the astronomically rare chance of a reference-code collision.
  for (let attempt = 0; attempt < 3 && !enquiry; attempt++) {
    try {
      enquiry = await AdmissionEnquiry.create({
        referenceId: generateReferenceId("RSA"),
        parentName,
        studentName,
        email,
        phone,
        grade,
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
    subject: `New Admission Enquiry — ${studentName} (${grade})`,
    html: `
      <h2>New Admission Enquiry</h2>
      <p><strong>Reference ID:</strong> ${enquiry.referenceId}</p>
      <p><strong>Parent Name:</strong> ${parentName}</p>
      <p><strong>Student Name:</strong> ${studentName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Grade Applying For:</strong> ${grade}</p>
      <p><strong>Message:</strong> ${message || "-"}</p>
    `,
  });

  sendEmail({
    to: email,
    subject: `Thank you for your enquiry — ${schoolName}`,
    html: `
      <h2>Thank You, ${parentName}!</h2>
      <p>We've received your admission enquiry for <strong>${studentName}</strong> (${grade}).</p>
      <p>Your reference ID is <strong>${enquiry.referenceId}</strong> — please keep it for your records.</p>
      <p>Our admissions team will connect with you soon.</p>
      <p>— ${schoolName}</p>
    `,
  });

  const contactLine = settings.phone ? ` Call us: ${settings.phone}.` : "";
  const addressLine = settings.address ? ` ${settings.address}.` : "";
  const smsAndWhatsAppText = `Thank you ${parentName}! Your admission enquiry for ${studentName} (${grade}) has been received at ${schoolName}.${addressLine} Reference ID: ${enquiry.referenceId}.${contactLine} We will connect with you soon via call/WhatsApp/email.`;
  sendWhatsApp({ to: phone, message: smsAndWhatsAppText });
  sendSMS({ to: phone, message: smsAndWhatsAppText });

  res.status(201).json({
    success: true,
    message: "Your enquiry has been submitted. Our team will contact you soon.",
    data: enquiry,
  });
});

// @desc    Get all admission enquiries
// @route   GET /api/admissions
// @access  Private/Admin
const getAdmissionEnquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const enquiries = await AdmissionEnquiry.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
});

// @desc    Update an admission enquiry's status
// @route   PATCH /api/admissions/:id
// @access  Private/Admin
const updateAdmissionEnquiryStatus = asyncHandler(async (req, res) => {
  const enquiry = await AdmissionEnquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  const previousStatus = enquiry.status;
  enquiry.status = req.body.status ?? enquiry.status;

  if (enquiry.status !== previousStatus && enquiry.status !== "new") {
    const settings = await SiteSettings.getSingleton();
    const schoolName = settings.schoolName || "Rising Star Public School";
    const schoolPhone = settings.phone || "";

    if (enquiry.status === "contacted") {
      const message = `Dear ${enquiry.parentName}, our admissions team at ${schoolName} has reviewed your enquiry for ${enquiry.studentName} (${enquiry.grade}). We will call you shortly at ${enquiry.phone} to discuss admission details.${schoolPhone ? ` School contact: ${schoolPhone}.` : ""}`;

      sendEmail({
        to: enquiry.email,
        subject: `We're reaching out — ${schoolName}`,
        html: `
          <h2>Dear ${enquiry.parentName},</h2>
          <p>Our admissions team has reviewed your enquiry for <strong>${enquiry.studentName}</strong> (${enquiry.grade}).</p>
          <p>We will call you shortly at <strong>${enquiry.phone}</strong> to discuss admission details and next steps.</p>
          <p>Reference ID: <strong>${enquiry.referenceId}</strong></p>
          <p>— ${schoolName}</p>
        `,
      });
      sendWhatsApp({ to: enquiry.phone, message });
      sendSMS({ to: enquiry.phone, message });
    } else if (enquiry.status === "resolved") {
      sendEmail({
        to: enquiry.email,
        subject: `Admission enquiry update — ${schoolName}`,
        html: `
          <h2>Dear ${enquiry.parentName},</h2>
          <p>Your admission enquiry for <strong>${enquiry.studentName}</strong> (${enquiry.grade}) has been marked as resolved.</p>
          <p>If you have any further questions, please feel free to contact us.${schoolPhone ? ` Phone: ${schoolPhone}.` : ""}</p>
          <p>— ${schoolName}</p>
        `,
      });
    }
  }

  await enquiry.save();

  res.status(200).json({ success: true, data: enquiry });
});

// @desc    Delete an admission enquiry
// @route   DELETE /api/admissions/:id
// @access  Private/Admin
const deleteAdmissionEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await AdmissionEnquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  await enquiry.deleteOne();
  res.status(200).json({ success: true, message: "Enquiry removed" });
});

module.exports = {
  createAdmissionEnquiry,
  getAdmissionEnquiries,
  updateAdmissionEnquiryStatus,
  deleteAdmissionEnquiry,
};

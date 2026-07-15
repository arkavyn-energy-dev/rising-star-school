const SiteSettings = require("../models/SiteSettings");
const asyncHandler = require("../utils/asyncHandler");
const { sendEmail, verifyEmailConnection, isEmailConfigured } = require("../utils/sendEmail");
const { getNotificationConfig } = require("../utils/notificationStatus");

// @desc    Get site settings (school info, fees, stats, about content, etc.)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  res.status(200).json({ success: true, data: settings });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();

  const allowedFields = [
    "schoolName",
    "tagline",
    "description",
    "phone",
    "email",
    "address",
    "timings",
    "establishedYear",
    "mapUrl",
    "socialLinks",
    "stats",
    "feeStructure",
    "admissionProcess",
    "documentsRequired",
    "programs",
    "whyChooseUs",
    "facilities",
    "aboutContent",
    "academics",
  ];

  for (const field of allowedFields) {
    if (req.body[field] === undefined) continue;

    if (field === "feeStructure") {
      settings.feeStructure = (req.body.feeStructure || []).filter((row) => row.grade?.trim());
      settings.markModified("feeStructure");
      continue;
    }

    if (field === "admissionProcess") {
      settings.admissionProcess = (req.body.admissionProcess || []).map((step) => ({
        ...step,
        step: Number(step.step),
      }));
      settings.markModified("admissionProcess");
      continue;
    }

    settings[field] = req.body[field];
    if (["stats", "programs", "whyChooseUs", "facilities", "documentsRequired", "aboutContent", "academics"].includes(field)) {
      settings.markModified(field);
    }
  }

  await settings.save();

  res.status(200).json({ success: true, data: settings });
});

// @desc    Check email/WhatsApp config + send a test email to admin inbox
// @route   POST /api/settings/test-email
// @access  Private/Admin
const testEmailSetup = asyncHandler(async (req, res) => {
  const config = getNotificationConfig();
  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER;

  if (!isEmailConfigured()) {
    res.status(400);
    throw new Error(
      "Email is not configured. Run in Backend folder: npm run email:setup YOUR_GMAIL_APP_PASSWORD"
    );
  }

  const verify = await verifyEmailConnection();
  if (!verify.ok) {
    res.status(400);
    throw new Error(`Gmail connection failed: ${verify.reason}`);
  }

  const result = await sendEmail({
    to,
    subject: "Rising Star Admin — test email",
    html: `
      <h2>Test successful</h2>
      <p>Your admin panel can send emails from <strong>${process.env.EMAIL_USER}</strong>.</p>
      <p>Student selection messages, admission alerts, and custom replies will use this account.</p>
    `,
  });

  if (!result.sent) {
    res.status(500);
    throw new Error(result.reason || "Failed to send test email");
  }

  res.status(200).json({
    success: true,
    message: `Test email sent to ${to}`,
    data: config,
  });
});

module.exports = { getSettings, updateSettings, testEmailSetup };

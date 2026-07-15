const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });

  sendEmail({
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: `New Contact Message — ${subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  });

  res.status(201).json({
    success: true,
    message: "Your message has been sent. We'll get back to you soon.",
    data: contactMessage,
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: messages.length, data: messages });
});

// @desc    Update a contact message's status
// @route   PATCH /api/contact/:id
// @access  Private/Admin
const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  message.status = req.body.status ?? message.status;
  await message.save();

  res.status(200).json({ success: true, data: message });
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await message.deleteOne();
  res.status(200).json({ success: true, message: "Message removed" });
});

module.exports = {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
};

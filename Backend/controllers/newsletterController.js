const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Subscribe an email to the newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await NewsletterSubscriber.findOne({ email: email?.toLowerCase() });
  if (existing) {
    return res.status(200).json({
      success: true,
      message: "You're already subscribed!",
    });
  }

  await NewsletterSubscriber.create({ email });

  res.status(201).json({ success: true, message: "Subscribed successfully!" });
});

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
});

module.exports = { subscribeNewsletter, getSubscribers };

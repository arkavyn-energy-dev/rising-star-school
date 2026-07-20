const asyncHandler = require("../utils/asyncHandler");
const { getChatReply } = require("../services/chatbotService");

// @desc    School AI chatbot (answers only from official school data)
// @route   POST /api/chatbot
// @access  Public
const chat = asyncHandler(async (req, res) => {
  const message = String(req.body?.message || "").trim();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  if (message.length > 1000) {
    res.status(400);
    throw new Error("Message is too long (max 1000 characters)");
  }

  const { reply, source } = await getChatReply(message, history);

  res.status(200).json({
    success: true,
    data: { reply, source },
  });
});

module.exports = { chat };

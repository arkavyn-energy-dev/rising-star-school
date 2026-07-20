const express = require("express");
const { chat } = require("../controllers/chatbotController");
const { formLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/", formLimiter, chat);

module.exports = router;

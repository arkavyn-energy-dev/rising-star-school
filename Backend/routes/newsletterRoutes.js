const express = require("express");
const { subscribeNewsletter, getSubscribers } = require("../controllers/newsletterController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { formLimiter } = require("../middleware/rateLimiter");
const { subscribeValidator } = require("../validators/newsletterValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/", formLimiter, subscribeValidator, validate, subscribeNewsletter);
router.get("/", protect, authorize("admin", "superadmin"), getSubscribers);

module.exports = router;

const express = require("express");
const {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { formLimiter } = require("../middleware/rateLimiter");
const { createContactValidator, updateStatusValidator } = require("../validators/contactValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/", formLimiter, createContactValidator, validate, createContactMessage);
router.get("/", protect, authorize("admin", "superadmin"), getContactMessages);
router.patch(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  updateStatusValidator,
  validate,
  updateContactMessageStatus
);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteContactMessage);

module.exports = router;

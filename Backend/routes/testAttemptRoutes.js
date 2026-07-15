const express = require("express");
const {
  getTestAttempts,
  updateTestAttemptStatus,
  sendTestAttemptMessage,
  getTestNotifyConfig,
  deleteTestAttempt,
} = require("../controllers/testAttemptController");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  updateTestAttemptStatusValidator,
  sendTestAttemptMessageValidator,
} = require("../validators/testValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/notify-config", protect, authorize("admin", "superadmin"), getTestNotifyConfig);
router.get("/", protect, authorize("admin", "superadmin"), getTestAttempts);
router.post(
  "/:id/message",
  protect,
  authorize("admin", "superadmin"),
  sendTestAttemptMessageValidator,
  validate,
  sendTestAttemptMessage
);
router.patch(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  updateTestAttemptStatusValidator,
  validate,
  updateTestAttemptStatus
);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteTestAttempt);

module.exports = router;

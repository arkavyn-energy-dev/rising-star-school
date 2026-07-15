const express = require("express");
const {
  createAdmissionEnquiry,
  getAdmissionEnquiries,
  updateAdmissionEnquiryStatus,
  deleteAdmissionEnquiry,
} = require("../controllers/admissionController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { formLimiter } = require("../middleware/rateLimiter");
const { createAdmissionValidator, updateStatusValidator } = require("../validators/admissionValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/", formLimiter, createAdmissionValidator, validate, createAdmissionEnquiry);
router.get("/", protect, authorize("admin", "superadmin"), getAdmissionEnquiries);
router.patch(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  updateStatusValidator,
  validate,
  updateAdmissionEnquiryStatus
);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteAdmissionEnquiry);

module.exports = router;

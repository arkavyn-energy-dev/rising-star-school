const express = require("express");
const {
  createJobApplication,
  getJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
} = require("../controllers/jobApplicationController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { formLimiter } = require("../middleware/rateLimiter");
const {
  createJobApplicationValidator,
  updateJobApplicationStatusValidator,
} = require("../validators/jobApplicationValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/", formLimiter, createJobApplicationValidator, validate, createJobApplication);
router.get("/", protect, authorize("admin", "superadmin"), getJobApplications);
router.patch(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  updateJobApplicationStatusValidator,
  validate,
  updateJobApplicationStatus
);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteJobApplication);

module.exports = router;

const express = require("express");
const {
  getTests,
  getTestById,
  getAllTestsAdmin,
  createTest,
  updateTest,
  deleteTest,
} = require("../controllers/testController");
const { submitTestAttempt } = require("../controllers/testAttemptController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { formLimiter } = require("../middleware/rateLimiter");
const { createTestValidator, submitTestAttemptValidator } = require("../validators/testValidators");
const validate = require("../middleware/validate");

const router = express.Router();

// IMPORTANT: /admin/all must be declared before /:id so Express doesn't
// treat "admin" as a test id.
router.get("/admin/all", protect, authorize("admin", "superadmin"), getAllTestsAdmin);

router.get("/", getTests);
router.get("/:id", getTestById);
router.post("/:id/attempts", formLimiter, submitTestAttemptValidator, validate, submitTestAttempt);

router.post("/", protect, authorize("admin", "superadmin"), createTestValidator, validate, createTest);
router.put("/:id", protect, authorize("admin", "superadmin"), updateTest);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteTest);

module.exports = router;

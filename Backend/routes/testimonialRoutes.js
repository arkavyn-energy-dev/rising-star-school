const express = require("express");
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { testimonialValidator } = require("../validators/testimonialValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", getTestimonials);
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),
  testimonialValidator,
  validate,
  createTestimonial
);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateTestimonial);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteTestimonial);

module.exports = router;

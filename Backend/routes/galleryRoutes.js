const express = require("express");
const {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { galleryValidator } = require("../validators/galleryValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", getGalleryImages);
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),
  galleryValidator,
  validate,
  createGalleryImage
);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteGalleryImage);

module.exports = router;

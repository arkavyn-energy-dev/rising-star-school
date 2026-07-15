const express = require("express");
const {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { facultyValidator } = require("../validators/facultyValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", getFaculty);
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),
  facultyValidator,
  validate,
  createFaculty
);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateFaculty);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteFaculty);

module.exports = router;

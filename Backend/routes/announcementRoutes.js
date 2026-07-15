const express = require("express");
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { announcementValidator } = require("../validators/announcementValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", getAnnouncements);
router.post("/", protect, authorize("admin", "superadmin"), announcementValidator, validate, createAnnouncement);
router.put("/:id", protect, authorize("admin", "superadmin"), updateAnnouncement);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteAnnouncement);

module.exports = router;

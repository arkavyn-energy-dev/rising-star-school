const express = require("express");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { eventValidator } = require("../validators/eventValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", getEvents);
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),
  eventValidator,
  validate,
  createEvent
);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateEvent);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteEvent);

module.exports = router;

const express = require("express");
const { getSettings, updateSettings, testEmailSetup } = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSettings);
router.post("/test-email", protect, authorize("admin", "superadmin"), testEmailSetup);
router.put("/", protect, authorize("admin", "superadmin"), updateSettings);

module.exports = router;

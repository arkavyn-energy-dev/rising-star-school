const express = require("express");
const { loginAdmin, logoutAdmin, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimiter");
const { loginValidator } = require("../validators/authValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/login", loginLimiter, loginValidator, validate, loginAdmin);
router.post("/logout", protect, logoutAdmin);
router.get("/me", protect, getMe);

module.exports = router;

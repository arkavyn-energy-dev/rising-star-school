const AdminUser = require("../models/AdminUser");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken, setTokenCookie, clearTokenCookie } = require("../utils/generateToken");

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await AdminUser.findOne({ email: email.toLowerCase() }).select("+password");

  if (!admin || !admin.isActive || !(await admin.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = generateToken({ id: admin._id, role: admin.role });
  setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// @desc    Get current logged-in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

module.exports = { loginAdmin, logoutAdmin, getMe };

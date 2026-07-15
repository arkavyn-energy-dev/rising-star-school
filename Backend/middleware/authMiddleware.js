const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const asyncHandler = require("../utils/asyncHandler");

// Verifies the JWT from the httpOnly cookie (falls back to Bearer header for
// tooling like Postman) and attaches the authenticated admin to req.admin.
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please log in");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(decoded.id);

    if (!admin || !admin.isActive) {
      res.status(401);
      throw new Error("Not authorized, account not found or disabled");
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid or expired token");
  }
});

// Restricts a route to specific admin roles, e.g. authorize("superadmin")
const authorize = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    res.status(403);
    throw new Error("You do not have permission to perform this action");
  }
  next();
};

module.exports = { protect, authorize };

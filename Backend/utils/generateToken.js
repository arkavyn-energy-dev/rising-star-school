const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const setTokenCookie = (res, token) => {
  const cookieExpiresDays = Number(process.env.COOKIE_EXPIRES_DAYS) || 7;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: cookieExpiresDays * 24 * 60 * 60 * 1000,
  });
};

const clearTokenCookie = (res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });
};

module.exports = { generateToken, setTokenCookie, clearTokenCookie };

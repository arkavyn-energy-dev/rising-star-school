const { body } = require("express-validator");

const createContactValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[+]?[\d\s-]{7,15}$/)
    .withMessage("Phone number is invalid"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 2000 }),
];

const updateStatusValidator = [
  body("status")
    .isIn(["new", "read", "resolved"])
    .withMessage("Status must be one of: new, read, resolved"),
];

module.exports = { createContactValidator, updateStatusValidator };

const { body } = require("express-validator");

const createAdmissionValidator = [
  body("parentName").trim().notEmpty().withMessage("Parent's name is required"),
  body("studentName").trim().notEmpty().withMessage("Student's name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("phone")
    .trim()
    .matches(/^[+]?[\d\s-]{7,15}$/)
    .withMessage("A valid phone number is required"),
  body("grade").trim().notEmpty().withMessage("Grade is required"),
  body("message").optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
];

const updateStatusValidator = [
  body("status")
    .isIn(["new", "contacted", "resolved"])
    .withMessage("Status must be one of: new, contacted, resolved"),
];

module.exports = { createAdmissionValidator, updateStatusValidator };

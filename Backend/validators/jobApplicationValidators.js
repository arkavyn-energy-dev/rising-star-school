const { body } = require("express-validator");

const createJobApplicationValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("phone")
    .trim()
    .matches(/^[+]?[\d\s-]{7,15}$/)
    .withMessage("A valid phone number is required"),
  body("subjectSpecialization").trim().notEmpty().withMessage("Subject specialization is required"),
  body("qualification").trim().notEmpty().withMessage("Qualification is required"),
  body("experienceYears").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Experience must be a positive number"),
  body("message").optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
];

const updateJobApplicationStatusValidator = [
  body("status")
    .isIn(["new", "shortlisted", "rejected", "hired"])
    .withMessage("Status must be one of: new, shortlisted, rejected, hired"),
];

module.exports = { createJobApplicationValidator, updateJobApplicationStatusValidator };

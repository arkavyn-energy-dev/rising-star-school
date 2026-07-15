const { body } = require("express-validator");

const createTestValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("className").trim().notEmpty().withMessage("Class is required"),
  body("durationMinutes").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("Duration must be a positive number"),
  body("questions").isArray({ min: 1 }).withMessage("At least one question is required"),
  body("questions.*.questionText").trim().notEmpty().withMessage("Question text is required"),
  body("questions.*.options")
    .isArray({ min: 4, max: 4 })
    .withMessage("Each question must have exactly 4 options"),
  body("questions.*.correctOptionIndex")
    .isInt({ min: 0, max: 3 })
    .withMessage("Correct option index must be between 0 and 3"),
];

const submitTestAttemptValidator = [
  body("studentName").trim().notEmpty().withMessage("Student's name is required"),
  body("studentClass").trim().notEmpty().withMessage("Student's class is required"),
  body("parentName").optional({ checkFalsy: true }).trim(),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("phone")
    .trim()
    .matches(/^[+]?[\d\s-]{7,15}$/)
    .withMessage("A valid phone number is required"),
  body("answers").isArray().withMessage("Answers must be an array"),
];

const updateTestAttemptStatusValidator = [
  body("status").isIn(["pending", "selected", "rejected"]).withMessage("Status must be one of: pending, selected, rejected"),
];

const sendTestAttemptMessageValidator = [
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("subject").optional({ checkFalsy: true }).trim(),
  body("sendEmail").optional().isBoolean(),
  body("sendWhatsApp").optional().isBoolean(),
];

module.exports = {
  createTestValidator,
  submitTestAttemptValidator,
  updateTestAttemptStatusValidator,
  sendTestAttemptMessageValidator,
};

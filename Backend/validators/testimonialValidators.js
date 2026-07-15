const { body } = require("express-validator");

const testimonialValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("role").trim().notEmpty().withMessage("Role is required"),
  body("quote").trim().notEmpty().withMessage("Quote is required"),
];

module.exports = { testimonialValidator };

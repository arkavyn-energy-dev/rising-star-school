const { body } = require("express-validator");

const facultyValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("designation").trim().notEmpty().withMessage("Designation is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("qualification").trim().notEmpty().withMessage("Qualification is required"),
];

module.exports = { facultyValidator };

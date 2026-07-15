const { body } = require("express-validator");

const eventValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Date must be valid"),
];

module.exports = { eventValidator };

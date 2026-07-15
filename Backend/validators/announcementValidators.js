const { body } = require("express-validator");

const announcementValidator = [
  body("text").trim().notEmpty().withMessage("Announcement text is required"),
];

module.exports = { announcementValidator };

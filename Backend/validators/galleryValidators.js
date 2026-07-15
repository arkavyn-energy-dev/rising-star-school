const { body } = require("express-validator");

const galleryValidator = [
  body("category")
    .isIn(["Campus", "Classroom", "Sports", "Events"])
    .withMessage("Category must be one of: Campus, Classroom, Sports, Events"),
];

module.exports = { galleryValidator };

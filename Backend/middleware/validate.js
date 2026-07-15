const { validationResult } = require("express-validator");

// Runs after express-validator rule chains; short-circuits with a 400 if
// any rule failed, otherwise passes control to the controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
};

module.exports = validate;

const { param, validationResult } = require("express-validator");

const validateParams = [
  // Validate and sanitize the `id` parameter
  param("id")
    .trim()
    .notEmpty()
    .withMessage("ID is required")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .toInt() // Convert the string to an integer
    .escape(),

  // Validate and sanitize the `role` parameter

  // Custom middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateParams;

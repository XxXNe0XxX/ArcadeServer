const { body, validationResult } = require("express-validator");

const validateMachine = [
  // Validate and sanitize request body fields
  body("game")
    .trim()
    .notEmpty()
    .withMessage("Game is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Game must contain only letters and spaces")
    .escape(),

  body("creditsPerGame")
    .trim()
    .toInt() // Convert the string to an integer
    .isInt({ min: 1 })
    .withMessage("Credits per game must be a positive integer")
    .escape(),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Email is not valid")
    .normalizeEmail(),

  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isString()
    .withMessage("Location must be a string")
    .isLength({ max: 100 })
    .withMessage("Location must be at most 100 characters long"),

  // Custom middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateMachine;

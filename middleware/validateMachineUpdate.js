const { body, validationResult } = require("express-validator");

const validateMachineUpdate = [
  // Validate and sanitize request body fields
  body("game")
    .optional()
    .trim()
    .notEmpty()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Game must contain only letters and spaces")
    .escape(),

  body("location").optional().trim().notEmpty().escape(),

  body("creditsPerGame")
    .optional()
    .trim()
    .toInt() // Convert the string to an integer
    .isInt({ min: 1 })
    .withMessage("CreditsPerGame must be a positive integer")
    .escape(),

  body("clientId")
    .optional()
    .trim()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .toInt() // Convert the string to an integer
    .escape(),

  // Custom middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateMachineUpdate;

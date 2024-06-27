const { body, validationResult } = require("express-validator");

const validateAddCredits = [
  body("add")
    .isInt({ gt: 0 })
    .withMessage("Add must be a positive integer")
    .notEmpty()
    .withMessage("Add is required")
    .toInt(),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number")
    .notEmpty()
    .withMessage("Amount is required")
    .toFloat(),

  body("currency")
    .trim()
    .isIn(["USD", "CUP", "MLC"])
    .withMessage("Currency must be one of the following: USD, CUP, MLC")
    .notEmpty()
    .withMessage("Currency is required")
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateAddCredits,
};

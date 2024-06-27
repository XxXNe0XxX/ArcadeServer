const { body, validationResult } = require("express-validator");

const validateExpense = [
  body("description")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Exceeded maximum lenght")
    .escape(),

  body("amountCharged")
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
  validateExpense,
};

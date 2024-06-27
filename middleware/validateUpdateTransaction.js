const { body, validationResult } = require("express-validator");

const validateUpdateTransaction = [
  body("amountCharged")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Add must be a positive integer")
    .toInt(),

  body("creditAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("creditAmount must be a positive number")
    .toFloat(),

  body("currency")
    .optional()
    .trim()
    .isIn(["USD", "CUP", "MLC", "DEDUCTED"])
    .withMessage(
      "Currency must be one of the following: USD, CUP, MLC, DEDUCTED"
    )
    .escape(),

  body("typeOfTransaction")
    .optional()
    .trim()
    .isIn(["ADD", "SUBTRACT", "EXPENSE"])
    .withMessage(
      "Type of transaction must be one of the following: ADD, SUBTRACT, EXPENSE"
    )
    .escape(),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Exceeded maximum lenght")
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
  validateUpdateTransaction,
};

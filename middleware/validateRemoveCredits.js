const { body, validationResult } = require("express-validator");

const validateRemoveCredits = [
  body("subtract")
    .isInt({ gt: 0 })
    .withMessage("Subtract must be a positive integer")
    .notEmpty()
    .withMessage("Subtract is required")
    .toInt(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRemoveCredits,
};

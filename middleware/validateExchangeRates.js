const { checkSchema, validationResult } = require("express-validator");

const validateExchangeRates = checkSchema({
  "*": {
    in: ["body"],
    isNumeric: {
      errorMessage: "Rate must be a number",
    },
    toFloat: true,
    custom: {
      options: (value, { req, location, path }) => {
        // You can add additional custom validation if needed
        const validCurrencies = ["USD", "EUR", "MLC"]; // Add all valid currencies
        if (!validCurrencies.includes(path)) {
          throw new Error(`Invalid currency: ${path}`);
        }
        return true;
      },
    },
  },
});

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateExchangeRates,
  checkValidation,
};

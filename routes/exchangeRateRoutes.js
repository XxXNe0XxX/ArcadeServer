const express = require("express");
const exchangeRatesControllers = require("../controllers/exchangeRateControllers");
const router = express.Router();
const validateIdentifier = require("../middleware/validateIdentifier");
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");
const {
  validateExchangeRates,
  checkValidation,
} = require("../middleware/validateExchangeRates");

router.get(
  "/",
  verifyJWT(["ADMIN"]),
  asyncHandler(exchangeRatesControllers.getExchangeRates)
);
router.get(
  "/cup",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(exchangeRatesControllers.getExchangeRatesWithCUPBase)
);
router.patch(
  "/update",
  verifyJWT(["ADMIN"]),
  validateExchangeRates,
  checkValidation,
  exchangeRatesControllers.updateExchangeRates
);

module.exports = router;

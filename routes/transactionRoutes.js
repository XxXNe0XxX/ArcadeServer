const express = require("express");
const transactionControllers = require("../controllers/transactionControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const validateParams = require("../middleware/validateParams");
const { validateExpense } = require("../middleware/validateExpense");
const {
  validateUpdateTransaction,
} = require("../middleware/validateUpdateTransaction");
const asyncHandler = require("express-async-handler");

router.get("/", verifyJWT(["ADMIN"]), transactionControllers.getTransactions);
router.get(
  "/:id",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateParams,
  asyncHandler(transactionControllers.getTransaction)
);
// router.post("/createTransaction", transactionControllers.createTransaction);
router.patch(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  validateUpdateTransaction,
  asyncHandler(transactionControllers.updateTransaction)
);
router.delete(
  "/:id",
  validateParams,
  verifyJWT(["ADMIN"]),
  asyncHandler(transactionControllers.deleteTransaction)
);

router.post(
  "/createExpense",
  verifyJWT(["ADMIN"]),
  validateExpense,
  asyncHandler(transactionControllers.createExpense)
);

module.exports = router;

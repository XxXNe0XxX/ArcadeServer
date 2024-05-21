const express = require("express");
const transactionControllers = require("../controllers/transactionControllers");
const router = express.Router();

router.get("/", transactionControllers.getTransactions);
router.get(
  "/getTransaction/:transactionId",
  transactionControllers.getTransactions
);
router.post("/createTransaction", transactionControllers.createTransaction);
router.put(
  "/updateTransaction/:transactionId",
  transactionControllers.updateTransaction
);
router.delete(
  "/deleteTransaction/:transactionId",
  transactionControllers.deleteTransaction
);
module.exports = router;

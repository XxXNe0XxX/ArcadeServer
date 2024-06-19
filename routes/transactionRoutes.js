const express = require("express");
const transactionControllers = require("../controllers/transactionControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
router.get("/", verifyJWT(["Admin"]), transactionControllers.getTransactions);
router.get(
  "/getTransaction/:transactionId",
  verifyJWT(["Admin", "Client"]),
  transactionControllers.getTransaction
);
// router.post("/createTransaction", transactionControllers.createTransaction);
router.put(
  "/updateTransaction/:transactionId",
  verifyJWT(["Admin"]),

  transactionControllers.updateTransaction
);
router.delete(
  "/deleteTransaction/:transactionId",
  verifyJWT(["Admin"]),

  transactionControllers.deleteTransaction
);

router.get(
  "/getClientTransactions/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  transactionControllers.getClientTransactions
);
router.post(
  "/createExpense/:clientEmail",
  verifyJWT(["Admin"]),
  transactionControllers.createExpense
);

module.exports = router;

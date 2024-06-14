const express = require("express");
const creditControllers = require("../controllers/creditControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

router.post(
  "/add-credits/:clientId",
  verifyJWT(["Admin"]),
  creditControllers.addCredits
);
router.post(
  "/remove-credits/:clientId",
  verifyJWT(["Admin"]),
  creditControllers.removeCredits
);
// router.get(
//   "/getTransaction/:transactionId",
//   creditControllers.getTransactions
// );
// router.post("/createTransaction", creditControllers.createTransaction);
// router.put(
//   "/updateTransaction/:transactionId",
//   creditControllers.updateTransaction
// );
// router.delete(
//   "/deleteTransaction/:transactionId",
//   creditControllers.deleteTransaction
// );
module.exports = router;

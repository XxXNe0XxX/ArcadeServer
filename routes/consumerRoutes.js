const express = require("express");
const consumerControllers = require("../controllers/consumerControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
router.use(verifyJWT);
router.get("/", consumerControllers.getConsumers);
router.post("/createConsumer", consumerControllers.createConsumer);
router.put("/updateConsumer/:consumerId", consumerControllers.updateConsumer);
router.delete(
  "/deleteConsumer/:consumerId",
  consumerControllers.deleteConsumer
);
router.get("/getConsumer/:consumerId", consumerControllers.getConsumer);

// Handle Credits

router.post("/add-credits/:consumerId", consumerControllers.addCredits);
router.post("/use-credits/:consumerId", consumerControllers.removeCredits);

// Get Transactions
router.get(
  "/getTransactions/:consumerId/transactions",
  consumerControllers.getTransactions
);

module.exports = router;

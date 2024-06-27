const express = require("express");
const clientControllers = require("../controllers/clientControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");
const validateQueries = require("../middleware/validateQueries");

// router.get("/", verifyJWT(["ADMIN"]), clientControllers.getClients);

router.get(
  "/info",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(clientControllers.getClientInfo)
);

router.get(
  "/machines",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(clientControllers.getMachines)
);
router.get(
  "/sessions",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(clientControllers.getGameSessions)
);
router.get(
  "/transactions",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(clientControllers.getTransactions)
);
router.get(
  "/qrcodes",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(clientControllers.getQrCodes)
);
router.post(
  "/changePassword",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(clientControllers.changePassword)
);

// Statistics
router.get(
  "/machinestatistics",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(clientControllers.getMachineUsageStatistics)
);
router.get(
  "/creditsSold",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateQueries,
  asyncHandler(clientControllers.getTotalCreditsSold)
);
router.get(
  "/revenue",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateQueries,
  asyncHandler(clientControllers.getTotalRevenue)
);
router.get(
  "/profitMargin",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateQueries,
  asyncHandler(clientControllers.getProfitMargin)
);
router.get(
  "/growthRate",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateQueries,
  asyncHandler(clientControllers.getSalesGrowthRate)
);
router.get(
  "/averageCredits",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateQueries,
  asyncHandler(clientControllers.getAverageCreditsSoldPerTransaction)
);

module.exports = router;

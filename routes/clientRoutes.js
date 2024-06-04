const express = require("express");
const clientControllers = require("../controllers/clientControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
// router.use(verifyJWT);
router.get("/", verifyJWT(["Admin"]), clientControllers.getClients);
router.get(
  "/getClient/:clientId",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getClient
);
router.post(
  "/createClient",
  verifyJWT(["Admin"]),
  clientControllers.createClient
);
router.put(
  "/updateClient/:clientId",
  verifyJWT(["Admin"]),
  clientControllers.updateClient
);
router.delete(
  "/deleteClient/:clientId",
  verifyJWT(["Admin"]),
  clientControllers.deleteClient
);
router.post(
  "/deactivateClient/:clientId",
  verifyJWT(["Admin"]),
  clientControllers.deactivateClient
);

// Client Queries

router.get(
  "/machines/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getMachines
);
router.get(
  "/balance/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getBalance
);
router.get(
  "/profits/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getProfits
);
router.get(
  "/expenses/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getExpenses
);
router.get(
  "/sessions/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getGameSessions
);
router.get(
  "/machinestatistics/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getMachineUsageStatistics
);
router.get(
  "/qrcodes/:clientEmail",
  verifyJWT(["Admin", "Client"]),
  clientControllers.getQrCodes
);
module.exports = router;

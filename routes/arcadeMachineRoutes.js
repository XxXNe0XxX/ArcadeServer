const express = require("express");
const arcadeMachineControllers = require("../controllers/arcadeMachineControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
router.get("/", arcadeMachineControllers.getArcadeMachines);
router.get(
  "/getArcadeMachine/:machineId",
  arcadeMachineControllers.getArcadeMachine
);
router.post(
  "/createArcadeMachine",
  verifyJWT(["Admin"]),
  arcadeMachineControllers.createArcadeMachine
);
router.put(
  "/updateArcadeMachine/:machineId",
  verifyJWT(["Admin"]),
  arcadeMachineControllers.updateArcadeMachine
);
router.delete(
  "/deleteArcadeMachine/:machineId",
  verifyJWT(["Admin"]),
  arcadeMachineControllers.deleteArcadeMachine
);
router.get(
  "/toggleArcadeMachine/:machineId",
  verifyJWT(["Admin"]),
  arcadeMachineControllers.toggleArcadeMachine
);

// Statisctics queries

router.get(
  "/getUsageByDay/:machineId/:date",
  verifyJWT(["Admin"]),
  arcadeMachineControllers.getUsageByDay
);
router.get(
  "/getUsageByMonth/:machineId/:yearMonth",
  verifyJWT(["Admin"]),
  arcadeMachineControllers.getUsageByMonth
);
router.get(
  "/getUsageByYear/:machineId/:year",
  verifyJWT(["Admin"]),
  arcadeMachineControllers.getUsageByYear
);
module.exports = router;

const express = require("express");
const arcadeMachineControllers = require("../controllers/arcadeMachineControllers");
const router = express.Router();

router.get("/", arcadeMachineControllers.getArcadeMachines);
router.get(
  "/getArcadeMachine/:machineId",
  arcadeMachineControllers.getArcadeMachine
);
router.post(
  "/createArcadeMachine",
  arcadeMachineControllers.createArcadeMachine
);
router.put(
  "/updateArcadeMachine/:machineId",
  arcadeMachineControllers.updateArcadeMachine
);
router.delete(
  "/deleteArcadeMachine/:machineId",
  arcadeMachineControllers.deleteArcadeMachine
);
module.exports = router;

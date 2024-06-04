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
module.exports = router;

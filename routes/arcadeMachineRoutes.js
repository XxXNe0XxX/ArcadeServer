const express = require("express");
const arcadeMachineControllers = require("../controllers/arcadeMachineControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");
const validateParams = require("../middleware/validateParams");
const validateMachineUpdate = require("../middleware/validateMachineUpdate");
const validateMachine = require("../middleware/validateMachine");

router.get("/", arcadeMachineControllers.getArcadeMachines);
router.get(
  "/manage",
  verifyJWT(["ADMIN"]),
  arcadeMachineControllers.manageArcadeMachines
);

router.get(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(arcadeMachineControllers.getArcadeMachine)
);

router.post(
  "/",
  verifyJWT(["ADMIN"]),
  validateMachine,
  asyncHandler(arcadeMachineControllers.createArcadeMachine)
);

router.patch(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  validateMachineUpdate,
  asyncHandler(arcadeMachineControllers.updateArcadeMachine)
);

router.delete(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(arcadeMachineControllers.deleteArcadeMachine)
);

router.get(
  "/toggle/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(arcadeMachineControllers.toggleArcadeMachine)
);

// Statisctics queries

router.get(
  "/getUsageByDay/:id/:date",
  verifyJWT(["ADMIN"]),
  asyncHandler(arcadeMachineControllers.getUsageByDay)
);
router.get(
  "/getUsageByMonth/:id/:yearMonth",
  verifyJWT(["ADMIN"]),
  asyncHandler(arcadeMachineControllers.getUsageByMonth)
);
router.get(
  "/getUsageByYear/:id/:year",
  verifyJWT(["ADMIN"]),
  asyncHandler(arcadeMachineControllers.getUsageByYear)
);
module.exports = router;

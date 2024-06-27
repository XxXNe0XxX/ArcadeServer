const express = require("express");
const gameSessionControllers = require("../controllers/gameSessionControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");

// router.get("/", gameSessionControllers.getGameSessions);
// router.get("/getGameSession/:sessionId", gameSessionControllers.getGameSession);

router.get(
  "/",
  verifyJWT(["ADMIN"]),
  asyncHandler(gameSessionControllers.getSessions)
);

router.post(
  "/createGameSession",
  asyncHandler(gameSessionControllers.createGameSession)
);

// router.put(
//   "/updateGameSession/:sessionId",
//   gameSessionControllers.updateGameSession
// );
// router.delete(
//   "/deleteGameSession/:sessionId",
//   gameSessionControllers.deleteGameSession
// );
module.exports = router;

const express = require("express");
const gameSessionControllers = require("../controllers/gameSessionControllers");
const router = express.Router();

// router.get("/", gameSessionControllers.getGameSessions);
// router.get("/getGameSession/:sessionId", gameSessionControllers.getGameSession);
router.post("/createGameSession", gameSessionControllers.createGameSession);
// router.put(
//   "/updateGameSession/:sessionId",
//   gameSessionControllers.updateGameSession
// );
// router.delete(
//   "/deleteGameSession/:sessionId",
//   gameSessionControllers.deleteGameSession
// );
module.exports = router;

const GameSession = require("../models/GameSession");

exports.getGameSessions = async (req, res) => {
  try {
    const sessions = await GameSession.findAll();
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching game sessions:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getGameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await GameSession.findByPk(sessionId);
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ error: "Game session not found" });
    }
  } catch (error) {
    console.error("Error fetching game session:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createGameSession = async (req, res) => {
  try {
    const { ConsumerID, MachineID, CreditsUsed, SessionDate } = req.body;
    const newSession = await GameSession.create({
      ConsumerID,
      MachineID,
      CreditsUsed,
      SessionDate,
    });
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error creating game session:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.updateGameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { ConsumerID, MachineID, CreditsUsed, SessionDate } = req.body;
    const session = await GameSession.findByPk(sessionId);
    if (session) {
      session.ConsumerID = ConsumerID;
      session.MachineID = MachineID;
      session.CreditsUsed = CreditsUsed;
      session.SessionDate = SessionDate;
      await session.save();
      res.json(session);
    } else {
      res.status(404).json({ error: "Game session not found" });
    }
  } catch (error) {
    console.error("Error updating game session:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.deleteGameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await GameSession.findByPk(sessionId);
    if (session) {
      await session.destroy();
      res.json({ message: "Game session deleted" });
    } else {
      res.status(404).json({ error: "Game session not found" });
    }
  } catch (error) {
    console.error("Error deleting game session:", error);
    res.status(500).json({ error: "Database error" });
  }
};

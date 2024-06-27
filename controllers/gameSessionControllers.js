const ArcadeMachine = require("../models/ArcadeMachine");
const GameSession = require("../models/GameSession");
const QRCode = require("../models/QRCode");

exports.getSessions = async (req, res) => {
  const sessions = await GameSession.findAll();
  return res.json(sessions);
};

// exports.getGameSession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const session = await GameSession.findByPk(sessionId);
//     if (session) {
//       res.json(session);
//     } else {
//       res.status(404).json({ error: "Game session not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching game session:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

exports.createGameSession = async (req, res) => {
  try {
    const { identifier, machineId } = req.body;
    if (!identifier || !machineId) {
      return res.status(400).json({
        message: "Bad request, missing fields: identifier or machineId",
      });
    }
    const machine = await ArcadeMachine.findByPk(machineId);
    const qr = await QRCode.findOne({ where: { Identifier: identifier } });

    if (!machine || !qr) {
      return res
        .status(404)
        .json({ message: "QR code not found or machine not recognized" });
    }
    if (machine.ClientID !== qr.ClientID) {
      return res
        .status(401)
        .json({ message: "QR cannot be used with this machine" });
    }
    if (qr.QRBalance < machine.CreditsPerGame) {
      return res.status(401).json({ message: "Not enough credits" });
    }
    if (!machine.Running) {
      return res.status(401).json({ message: "Machine is not running" });
    }
    if (
      machine.ClientID === qr.ClientID &&
      qr.QRBalance >= machine.CreditsPerGame
    ) {
      const newSession = await GameSession.create({
        ClientID: qr.ClientID,
        QRCodeID: qr.QRCodeID,
        Date: new Date(),
        MachineID: machineId,
      });
      qr.QRBalance -= machine.CreditsPerGame;
      await qr.save();
      return res.status(201).json({
        status: "success",
        newSession,
        message: `Game session created successfully, qr code remaining credits: ${qr.QRBalance}`,
      });
    }
  } catch (error) {
    console.error("Error creating game session:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// exports.updateGameSession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const { ConsumerID, MachineID, CreditsUsed, SessionDate } = req.body;
//     const session = await GameSession.findByPk(sessionId);
//     if (session) {
//       session.ConsumerID = ConsumerID;
//       session.MachineID = MachineID;
//       session.CreditsUsed = CreditsUsed;
//       session.SessionDate = SessionDate;
//       await session.save();
//       res.json(session);
//     } else {
//       res.status(404).json({ error: "Game session not found" });
//     }
//   } catch (error) {
//     console.error("Error updating game session:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

// exports.deleteGameSession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const session = await GameSession.findByPk(sessionId);
//     if (session) {
//       await session.destroy();
//       res.json({ message: "Game session deleted" });
//     } else {
//       res.status(404).json({ error: "Game session not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting game session:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

const ArcadeMachine = require("../models/ArcadeMachine");

exports.getArcadeMachines = async (req, res) => {
  try {
    const machines = await ArcadeMachine.findAll();
    res.json(machines);
  } catch (error) {
    console.error("Error fetching arcade machines:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getArcadeMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const machine = await ArcadeMachine.findByPk(machineId);
    if (machine) {
      res.json(machine);
    } else {
      res.status(404).json({ error: "Arcade machine not found" });
    }
  } catch (error) {
    console.error("Error fetching arcade machine:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createArcadeMachine = async (req, res) => {
  try {
    const { clientId, Running, GameName, CreditsPerGame } = req.body;
    if (!clientId || !GameName || !CreditsPerGame) {
      res.status(400).json({ message: "Bad request missing fields" });
    }
    const newMachine = await ArcadeMachine.create({
      ClientID: clientId,
      Running: Running ? Running : false,
      Game: GameName,
      CreditsPerGame: CreditsPerGame,
    });
    res.status(201).json(newMachine);
  } catch (error) {
    console.error("Error creating arcade machine:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.updateArcadeMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { ClientID, Game, CreditsPerGame } = req.body;

    if (!machineId || !ClientID || !Game || !CreditsPerGame) {
      res.status(400).json({ message: "Bad request fields missing" });
    }
    const machine = await ArcadeMachine.findByPk(machineId);
    if (!machine) {
      res.status(404).json({ error: "Arcade machine not found" });
    }
    machine.ClientID = ClientID;
    machine.Game = Game;
    machine.CreditsPerGame = CreditsPerGame;
    await machine.save();
    res.status(204).json({
      message: "machine updated successfully",
    });
  } catch (error) {
    console.error("Error updating arcade machine:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.deleteArcadeMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const machine = await ArcadeMachine.findByPk(machineId);
    if (machine) {
      await machine.destroy();
      res.json({ message: "Arcade machine deleted" });
    } else {
      res.status(404).json({ error: "Arcade machine not found" });
    }
  } catch (error) {
    console.error("Error deleting arcade machine:", error);
    res.status(500).json({ error: "Database error" });
  }
};

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
    const { ClientID, MachineLocation, GameName, CreditsPerGame } = req.body;
    const newMachine = await ArcadeMachine.create({
      ClientID,
      MachineLocation,
      GameName,
      CreditsPerGame,
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
    const { ClientID, MachineLocation, GameName, CreditsPerGame } = req.body;
    const machine = await ArcadeMachine.findByPk(machineId);
    if (machine) {
      machine.ClientID = ClientID;
      machine.MachineLocation = MachineLocation;
      machine.GameName = GameName;
      machine.CreditsPerGame = CreditsPerGame;
      await machine.save();
      res.json(machine);
    } else {
      res.status(404).json({ error: "Arcade machine not found" });
    }
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

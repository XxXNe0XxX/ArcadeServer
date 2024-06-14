const ArcadeMachine = require("../models/ArcadeMachine");
const Client = require("../models/Client");
const GameSession = require("../models/GameSession");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

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

//OK
exports.createArcadeMachine = async (req, res) => {
  try {
    const { email, game, creditsPerGame } = req.body.formData;
    if (!email || !game || !creditsPerGame) {
      return res.status(400).json({ message: "Bad request missing fields" });
    }
    const client = await Client.findOne({ where: { ClientEmail: email } });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    if (client) {
      const newMachine = await ArcadeMachine.create({
        ClientID: client.ClientID,
        Running: false,
        Game: game,
        CreditsPerGame: creditsPerGame,
      });
      return res.status(201).json(newMachine);
    }
  } catch (error) {
    console.error("Error creating arcade machine:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.updateArcadeMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { clientId, game, creditsPerGame } = req.body.formData;

    if (!machineId) {
      return res
        .status(400)
        .json({ message: "Bad request: Missing url params" });
    }
    if (!clientId && !game && !creditsPerGame) {
      return res.status(400).json({ message: "Bad request: Fields missing" });
    }
    const machine = await ArcadeMachine.findByPk(machineId);
    if (!machine) {
      return res.status(404).json({ error: "Arcade machine not found" });
    }
    const updateFields = {};
    if (clientId) updateFields.ClientID = clientId;
    if (game) updateFields.Game = game;
    if (creditsPerGame) updateFields.CreditsPerGame = creditsPerGame;

    if (machine) {
      await machine.update(updateFields);
      return res.status(204).json({
        message: "Machine updated successfully",
      });
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

exports.toggleArcadeMachine = async (req, res) => {
  try {
    const { machineId } = req.params;

    if (!machineId) {
      res.status(400).json({ message: "Bad request fields missing" });
    }
    const machine = await ArcadeMachine.findByPk(machineId);
    if (!machine) {
      res.status(404).json({ message: "Machine not found" });
    }
    if (machine) {
      machine.Running = !machine.Running;
      await machine.save();
      res.json({
        status: `${machine.Running ? "activated" : "deactivated"}`,
        message: `Arcade machine ${
          machine.Running ? "activated" : "deactivated"
        }`,
      });
    } else {
      res.status(404).json({ error: "Arcade machine not found" });
    }
  } catch (error) {
    console.error("Error deleting arcade machine:", error);
    res.status(500).json({ error: "Database error" });
  }
};

const aggregateUsageData = async (machineId, dateQuery, groupBy) => {
  return await GameSession.findAll({
    attributes: [
      [groupBy, "time_period"],
      [sequelize.fn("COUNT", sequelize.col("SessionID")), "usage_count"],
    ],
    where: {
      MachineID: machineId,
      Date: dateQuery,
    },
    group: ["time_period"],
    order: [["time_period", "ASC"]],
  });
};

exports.getUsageByDay = async (req, res) => {
  try {
    const { machineId, date } = req.params;
    const data = await aggregateUsageData(
      machineId,
      sequelize.where(sequelize.fn("DATE", sequelize.col("Date")), date),
      sequelize.fn("HOUR", sequelize.col("Date"))
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUsageByMonth = async (req, res) => {
  try {
    const { machineId, yearMonth } = req.params;
    const data = await aggregateUsageData(
      machineId,
      sequelize.where(
        sequelize.fn("DATE_FORMAT", sequelize.col("Date"), "%Y-%m"),
        yearMonth
      ),
      sequelize.fn("DAY", sequelize.col("Date"))
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsageByYear = async (req, res) => {
  try {
    const { machineId, year } = req.params;
    const data = await aggregateUsageData(
      machineId,
      sequelize.where(sequelize.fn("YEAR", sequelize.col("Date")), year),
      sequelize.fn("MONTH", sequelize.col("Date"))
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// try {
//   const { machineId, date } = req.params;
//   if (!machineId || !date) {
//     return res
//       .status(400)
//       .json({ message: "Missing machineId or date parameter" });
//   }
//   const targetDate = new Date(date);
//   if (isNaN(targetDate.getTime())) {
//     return res.status(400).json({ message: "Invalid date parameter" });
//   }

//   const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

//   const sessions = await GameSession.findAll({
//     where: {
//       MachineID: machineId,
//       Date: {
//         [Op.between]: [startOfDay, endOfDay],
//       },
//     },
//     attributes: ["Date"],
//   });

//   // Initialize usage data with zero counts for each hour
//   const usageByHour = {};
//   for (let hour = 0; hour < 24; hour++) {
//     usageByHour[`${hour}:00 - ${hour + 1}:00`] = [];
//   }

//   // Group sessions by hour
//   sessions.forEach((session) => {
//     const hour = new Date(session.Date).getHours();
//     usageByHour[`${hour}:00 - ${hour + 1}:00`].push(session);
//   });

//   res.status(200).json(usageByHour);
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: "Internal server error" });
// }

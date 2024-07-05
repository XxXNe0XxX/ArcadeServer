const ArcadeMachine = require("../models/ArcadeMachine");
const Client = require("../models/Client");
const GameSession = require("../models/GameSession");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const User = require("../models/User");
const formatTimestamps = require("../utils/formatDate");

// CREATE
exports.createArcadeMachine = async (req, res) => {
  const { email, game, creditsPerGame, location } = req.body;

  const user = await User.findOne({ where: { Email: email } });
  if (!user) {
    return res.status(404).json({ message: "Client not found" });
  }
  const client = await Client.findOne({ where: { UserID: user.UserID } });
  if (client) {
    const newMachine = await ArcadeMachine.create({
      ClientID: client.ClientID,
      Running: false,
      Game: game,
      CreditsPerGame: creditsPerGame || 1,
      Location: location,
    });
    return res.status(201).json(newMachine);
  }
};

// READ ALL
exports.getArcadeMachines = async (req, res) => {
  const machines = await ArcadeMachine.findAll({
    attributes: {
      exclude: ["ClientID", "MachineID", "createdAt", "updatedAt"],
    },
  });
  return res.json(machines);
};

exports.manageArcadeMachines = async (req, res) => {
  const machines = await ArcadeMachine.findAll({
    include: {
      model: Client,
      attributes: ["UserID"],

      include: {
        model: User,
        attributes: ["Email"],
      },
    },
  });

  const formattedMachines = machines.map((machine) => {
    const machineData = machine.toJSON();
    return {
      ...machineData,
      Client: { UserID: undefined },
      User: machineData.Client.User.Email,
      ClientID: undefined, // Remove ClientID field if needed
    };
  });

  return res.status(200).json(formatTimestamps(formattedMachines));
};

// READ ONE
exports.getArcadeMachine = async (req, res) => {
  const { id } = req.params;
  const machine = await ArcadeMachine.findByPk(id);
  if (machine) {
    res.json(machine);
  } else {
    res.status(404).json({ error: "Arcade machine not found" });
  }
};

// UPDATE
exports.updateArcadeMachine = async (req, res) => {
  const { id } = req.params;
  const { clientID, game, creditsPerGame, location } = req.body;

  const machine = await ArcadeMachine.findByPk(id);
  if (!machine) {
    return res.status(404).json({ error: "Arcade machine not found" });
  }
  const updateFields = {};
  if (clientID) updateFields.ClientID = clientID;
  if (game) updateFields.Game = game;
  if (creditsPerGame) updateFields.CreditsPerGame = creditsPerGame;
  if (location) updateFields.Location = location;

  if (machine) {
    await machine.update(updateFields);
    return res.status(204).json({
      message: "Machine updated successfully",
    });
  } else {
    return res.status(400).json({ message: "Arcade Machine not found" });
  }
};

// DELETE
exports.deleteArcadeMachine = async (req, res) => {
  const { id } = req.params;
  const machine = await ArcadeMachine.findByPk(id);
  if (machine) {
    await machine.destroy();
    res.json({ message: "Arcade machine deleted" });
  } else {
    res.status(404).json({ error: "Arcade machine not found" });
  }
};

// TOGGLE
exports.toggleArcadeMachine = async (req, res) => {
  const { id } = req.params;

  const machine = await ArcadeMachine.findByPk(id);
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
};

const aggregateUsageData = async (machineId, dateQuery, groupBy) => {
  return await GameSession.findAll({
    attributes: [
      [groupBy, "time_period"],
      [sequelize.fn("COUNT", sequelize.col("SessionID")), "usage_count"],
    ],
    where: {
      MachineID: machineId,
      createdAt: dateQuery,
    },
    group: ["time_period"],
    order: [["time_period", "ASC"]],
  });
};

exports.getUsageByDay = async (req, res) => {
  try {
    const { id, date } = req.params;
    const data = await aggregateUsageData(
      id,
      sequelize.where(sequelize.fn("DATE", sequelize.col("createdAt")), date),
      sequelize.fn("HOUR", sequelize.col("createdAt"))
    );
    return res.json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: error.message });
  }
};
exports.getUsageByMonth = async (req, res) => {
  try {
    const { id, yearMonth } = req.params;
    const data = await aggregateUsageData(
      id,
      sequelize.where(
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
        yearMonth
      ),
      sequelize.fn("DAY", sequelize.col("createdAt"))
    );
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getUsageByYear = async (req, res) => {
  try {
    const { id, year } = req.params;
    const data = await aggregateUsageData(
      id,
      sequelize.where(sequelize.fn("YEAR", sequelize.col("createdAt")), year),
      sequelize.fn("MONTH", sequelize.col("createdAt"))
    );
    return res.json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: error.message });
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

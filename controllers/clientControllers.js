const Client = require("../models/Client");
const bcrypt = require("bcrypt");
const ArcadeMachine = require("../models/ArcadeMachine");
const Transaction = require("../models/Transaction");
const GameSession = require("../models/GameSession");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const QRCode = require("../models/QRCode");
const User = require("../models/User");
const { calculateDateRange } = require("../utils/calculateDateRange");
// Starts here

// INFO
exports.getClientInfo = async (req, res) => {
  const clientEmail = req.user;
  const user = await User.findOne({ where: { Email: clientEmail } });
  if (user) {
    const clientInfo = await Client.findOne({
      where: { UserID: user.UserID },
      include: [
        {
          model: User,
          attributes: { exclude: ["Password"] },
        },
      ],
    });
    return res.json(clientInfo);
  } else {
    return res.status(404).json({ message: "Client not found" });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const clientEmail = req.user;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findOne({ where: { Email: clientEmail } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.Password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect current password" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.Password = hashedPassword;
  await user.save();

  return res.status(200).json({ message: "Password changed successfully" });
};

// GET MACHINES
exports.getMachines = async (req, res) => {
  console.log(`${req.id}, "line 56`);
  const userId = req.id;
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else if (user) {
    const client = await Client.findOne({
      where: { UserID: user.UserID },
    });
    if (!client) {
      res.status(404).json({ message: "Client not found" });
    }
    const clientId = client.ClientID;
    const machines = await ArcadeMachine.findAll({
      where: { ClientID: clientId },
    });
    res.status(200).json({ machines: machines });
  }
};

exports.getGameSessions = async (req, res) => {
  const id = req.id;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const client = await Client.findOne({ where: { UserID: user.UserID } });
  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }
  const machines = await ArcadeMachine.findAll({
    where: { ClientID: client.ClientID },
  });
  if (!machines) {
    return res.status(404).json({ message: "Machines not found" });
  }
  const machineIds = machines.map((machine) => machine.MachineID);
  const gameSessions = await GameSession.findAll({
    include: [
      {
        model: ArcadeMachine,
        attributes: {
          exclude: [
            "MachineID",
            "createdAt",
            "updatedAt",
            "ClientID",
            "Location",
          ],
        },
      },
    ],
    where: { MachineID: machineIds },
    attributes: {
      exclude: ["SessionID", "MachineID"],
    },
  });

  if (gameSessions.length === 0) {
    return res.status(404).json({ message: "Sessions not found" });
  }
  const formattedSessions = gameSessions.map((session) => ({
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    QRCodeID: session.QRCodeID,
    Game: session.ArcadeMachine.Game,
    CreditsPerGame: session.ArcadeMachine.CreditsPerGame,
    Running: session.ArcadeMachine.Running,
  }));
  return res.status(200).json(formattedSessions);
};

exports.getTransactions = async (req, res) => {
  const id = req.id;
  const transactions = await Transaction.findAll({ where: { UserID: id } });
  if (!transactions) {
    return res.status(404).json({ message: "No Transactions found" });
  }
  return res.status(200).json(transactions);
};

exports.getQrCodes = async (req, res) => {
  const email = req.user;
  const user = await User.findOne({ where: { Email: email } });
  if (user) {
    const client = await Client.findOne({ where: { UserID: user.UserID } });
    if (client) {
      const qrcodes = await QRCode.findAll({
        where: { ClientID: client.ClientID },
      });

      return res.status(200).json(qrcodes);
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

exports.getTotalCreditsSold = async (req, res) => {
  // Helper function
  const { date, period } = req.query;
  const { startDate, endDate } = calculateDateRange(date, period);

  const totalCreditsSold = await Transaction.sum("CreditAmount", {
    where: {
      TypeOfTransaction: "SUBTRACT",
      Currency: {
        [Op.or]: ["MLC", "CUP", "USD"],
      },
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return res.status(200).json({
    totalCreditsSold: totalCreditsSold || 0,
  });
};
exports.getTotalRevenue = async (req, res) => {
  // Helper function
  const { date, period } = req.query;
  const { startDate, endDate } = calculateDateRange(date, period);
  const currencies = ["MLC", "USD", "CUP"];
  const revenueByCurrency = [];
  for (const currency of currencies) {
    const totalRevenue = await Transaction.sum("AmountCharged", {
      where: {
        TypeOfTransaction: "SUBTRACT",
        Currency: currency,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    revenueByCurrency.push({
      currency,
      totalRevenue: totalRevenue || 0,
    });
  }
  return res.status(200).json(revenueByCurrency);
};

exports.getProfitMargin = async (req, res) => {
  const { date, period } = req.query;

  const { startDate, endDate } = calculateDateRange(date, period);

  const currencies = ["MLC", "USD", "CUP"];
  const profitMarginByCurrency = [];

  for (const currency of currencies) {
    const totalRevenue = await Transaction.sum("AmountCharged", {
      where: {
        TypeOfTransaction: "SUBTRACT",
        Currency: currency,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const totalCost = await Transaction.sum("AmountCharged", {
      where: {
        TypeOfTransaction: "ADD",
        Currency: currency,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    console.log(totalCost);
    const revenue = totalRevenue || 0;
    const cost = totalCost || 0;
    const profitMargin = revenue
      ? Math.round(((revenue - cost) / revenue) * 100)
      : 0;

    profitMarginByCurrency.push({
      currency,
      profitMargin,
      cost,
      revenue,
    });
  }

  return res.status(200).json(profitMarginByCurrency);
};

exports.getSalesGrowthRate = async (req, res) => {
  const { date, period } = req.query;
  const { startDate, endDate } = calculateDateRange(date, period);
  let prevStartDate, prevEndDate;

  switch (period) {
    case "day":
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(startDate.getDate() - 1);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate = new Date(prevStartDate);
      prevEndDate.setHours(23, 59, 59, 999);
      break;
    case "week":
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(startDate.getDate() - 7);
      prevEndDate = new Date(prevStartDate);
      prevEndDate.setDate(prevEndDate.getDate() + 6);
      break;
    case "month":
      prevStartDate = new Date(startDate);
      prevStartDate.setMonth(startDate.getMonth() - 1);
      prevStartDate.setDate(1);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate = new Date(prevStartDate);
      prevEndDate.setMonth(prevEndDate.getMonth() + 1);
      prevEndDate.setDate(0);
      prevEndDate.setHours(23, 59, 59, 999);
      break;
    case "year":
      prevStartDate = new Date(startDate);
      prevStartDate.setFullYear(startDate.getFullYear() - 1);
      prevStartDate.setMonth(0, 1); // January 1st
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate = new Date(prevStartDate);
      prevEndDate.setFullYear(prevEndDate.getFullYear() + 1);
      prevEndDate.setMonth(11, 31); // December 31st
      prevEndDate.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid period specified");
  }

  const currentPeriodSales = await Transaction.sum("CreditAmount", {
    where: {
      TypeOfTransaction: "SUBTRACT",
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const previousPeriodSales = await Transaction.sum("CreditAmount", {
    where: {
      TypeOfTransaction: "SUBTRACT",
      createdAt: {
        [Op.between]: [prevStartDate, prevEndDate],
      },
    },
  });

  const currentSales = currentPeriodSales || 0;
  const previousSales = previousPeriodSales || 0;

  const salesGrowthRate = previousSales
    ? Math.round(((currentSales - previousSales) / previousSales) * 100)
    : 0;

  return res.status(200).json({ salesGrowthRate });
};

exports.getAverageCreditsSoldPerTransaction = async (req, res) => {
  const { date, period } = req.query;
  const { startDate, endDate } = calculateDateRange(date, period);

  const totalCreditsSold = await Transaction.sum("CreditAmount", {
    where: {
      TypeOfTransaction: "SUBTRACT",
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const transactionCount = await Transaction.count({
    where: {
      TypeOfTransaction: "SUBTRACT",
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const averageCreditsSoldPerTransaction = transactionCount
    ? Math.round(totalCreditsSold / transactionCount)
    : 0;

  return res.status(200).json({ averageCreditsSoldPerTransaction });
};
// FIX ME

exports.getMachineUsageStatistics = async (req, res) => {
  const clientEmail = req.user;

  if (!clientEmail) {
    return res
      .status(400)
      .json({ message: "Missing URL parameter: clientEmail" });
  }

  // Fetch the client to ensure they exist
  const user = await User.findOne({
    where: { Email: clientEmail },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const client = await Client.findOne({ where: { UserID: user.UserID } });
  // Fetch the machines associated with the client
  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }
  const machines = await ArcadeMachine.findAll({
    where: { ClientID: client.ClientID },
  });

  if (machines.length === 0) {
    return res.status(404).json({ message: "Machines not found" });
  }

  // Define the date ranges for MySQL
  const startOfDay = Sequelize.literal("CURDATE()");
  const startOfWeek = Sequelize.literal(
    "DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)"
  );
  const startOfMonth = Sequelize.literal(
    "DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE()) - 1 DAY)"
  );
  const startOfYear = Sequelize.literal(
    "DATE_SUB(CURDATE(), INTERVAL DAYOFYEAR(CURDATE()) - 1 DAY)"
  );

  const statistics = await Promise.all(
    machines.map(async (machine) => {
      const dailyUsage = await GameSession.count({
        where: {
          MachineID: machine.MachineID,
          createdAt: { [Sequelize.Op.gte]: startOfDay },
        },
      });

      const weeklyUsage = await GameSession.count({
        where: {
          MachineID: machine.MachineID,
          createdAt: { [Sequelize.Op.gte]: startOfWeek },
        },
      });

      const monthlyUsage = await GameSession.count({
        where: {
          MachineID: machine.MachineID,
          createdAt: { [Sequelize.Op.gte]: startOfMonth },
        },
      });

      const yearlyUsage = await GameSession.count({
        where: {
          MachineID: machine.MachineID,
          createdAt: { [Sequelize.Op.gte]: startOfYear },
        },
      });

      return {
        machineId: machine.MachineID,
        machineName: machine.Game, // Adjust according to your model
        dailyUsage,
        weeklyUsage,
        monthlyUsage,
        yearlyUsage,
      };
    })
  );

  // Return the aggregated results
  return res.status(200).json(statistics);
};

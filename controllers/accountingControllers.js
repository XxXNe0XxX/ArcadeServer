const { Op } = require("sequelize");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const ExchangeRate = require("../models/ExchangeRate");
const { calculateDateRange } = require("../utils/calculateDateRange");
const sequelize = require("sequelize");
exports.getStatistics = async (req, res) => {
  try {
    const { currency = "USD" } = req.query;

    const exchangeRates = await ExchangeRate.findAll();
    const rates = exchangeRates.reduce((acc, rate) => {
      acc[rate.Currency] = rate.Rate;
      return acc;
    }, {});

    if (!rates[currency]) {
      return res.status(400).json({ error: "Invalid currency" });
    }

    const transactions = await Transaction.findAll();
    const users = await User.findAll();

    const userRoles = users.reduce((acc, user) => {
      acc[user.UserID] = user.Role;
      return acc;
    }, {});

    const totalRevenue = { [currency]: 0 };
    const totalExpenses = { [currency]: 0 };
    const revenueByClient = {};
    const expensesByClient = {};
    const monthlyRevenue = {};
    const monthlyExpenses = {};
    const transactionCounts = {
      ADD: { [currency]: 0 },
      SUBTRACT: { [currency]: 0 },
      EXPENSE: { [currency]: 0 },
    };

    transactions.forEach((transaction) => {
      const {
        AmountCharged,
        Currency,
        ExchangeRate,
        TypeOfTransaction,
        UserID,
        createdAt,
      } = transaction;

      const amountInRequestedCurrency =
        (AmountCharged * ExchangeRate) / rates[currency];
      transactionCounts[TypeOfTransaction][currency]++;

      if (TypeOfTransaction === "ADD") {
        totalRevenue[currency] += amountInRequestedCurrency;
        if (!revenueByClient[UserID]) {
          revenueByClient[UserID] = { [currency]: 0 };
        }
        revenueByClient[UserID][currency] += amountInRequestedCurrency;

        const month = createdAt.toISOString().slice(0, 7);
        if (!monthlyRevenue[month]) {
          monthlyRevenue[month] = { [currency]: 0 };
        }
        monthlyRevenue[month][currency] += amountInRequestedCurrency;
      } else if (
        TypeOfTransaction === "EXPENSE" &&
        userRoles[UserID] === "ADMIN"
      ) {
        totalExpenses[currency] += amountInRequestedCurrency;
        if (!expensesByClient[UserID]) {
          expensesByClient[UserID] = { [currency]: 0 };
        }
        expensesByClient[UserID][currency] += amountInRequestedCurrency;

        const month = createdAt.toISOString().slice(0, 7);
        if (!monthlyExpenses[month]) {
          monthlyExpenses[month] = { [currency]: 0 };
        }
        monthlyExpenses[month][currency] += amountInRequestedCurrency;
      }
    });

    const netProfit = {
      [currency]: totalRevenue[currency] - totalExpenses[currency],
    };

    const netProfitMargin = {
      [currency]: totalRevenue[currency]
        ? (netProfit[currency] / totalRevenue[currency]) * 100
        : 0,
    };

    // Fetch clients without Admin and Technician roles
    const nonAdminClients = await User.count({
      where: {
        Role: {
          [sequelize.Op.notIn]: ["ADMIN", "TECHNICIAN"],
        },
      },
    });

    const averageRevenuePerUser = {
      [currency]: nonAdminClients
        ? totalRevenue[currency] / nonAdminClients
        : 0,
    };

    const revenueGrowthRate = await calculateGrowthRate(
      Transaction,
      "AmountCharged",
      "ADD",
      rates[currency]
    );
    const expenseGrowthRate = await calculateGrowthRate(
      Transaction,
      "AmountCharged",
      "EXPENSE",
      rates[currency]
    );

    // Calculate average transaction value per currency
    const averageTransactionValue = {
      ADD: {
        [currency]: transactionCounts.ADD[currency]
          ? totalRevenue[currency] / transactionCounts.ADD[currency]
          : 0,
      },
      SUBTRACT: {
        [currency]: transactionCounts.SUBTRACT[currency]
          ? totalRevenue[currency] / transactionCounts.SUBTRACT[currency]
          : 0,
      },
      EXPENSE: {
        [currency]: transactionCounts.EXPENSE[currency]
          ? totalRevenue[currency] / transactionCounts.EXPENSE[currency]
          : 0,
      },
    };

    // Get top clients by revenue
    const topClients = Object.entries(revenueByClient)
      .map(([clientID, revenue]) => ({
        clientID,
        revenue,
      }))
      .sort((a, b) => b.revenue[currency] - a.revenue[currency])
      .slice(0, 5);

    // Calculate monthly net profit
    const monthlyNetProfit = {};
    Object.keys(monthlyRevenue).forEach((month) => {
      monthlyNetProfit[month] = {
        [currency]:
          monthlyRevenue[month][currency] -
          (monthlyExpenses[month]?.[currency] || 0),
      };
    });

    return res.status(200).json({
      totalRevenue,
      revenueByClient,
      monthlyRevenue,
      totalExpenses,
      expensesByClient,
      monthlyExpenses,
      netProfit,
      netProfitMargin,
      totalClients: nonAdminClients, // total clients excluding admins
      averageRevenuePerUser,
      revenueGrowthRate,
      expenseGrowthRate,
      averageTransactionValue,
      topClients,
      monthlyNetProfit,
    });
  } catch (error) {
    console.error("Error fetching accounting statistics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateGrowthRate = async (model, field, type, rate) => {
  const data = await model.findAll({
    attributes: [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
        "month",
      ],
      [
        sequelize.fn(
          "SUM",
          sequelize.literal(`${field} * ExchangeRate / ${rate}`)
        ),
        "total",
      ],
    ],
    where: {
      TypeOfTransaction: type,
    },
    group: ["month"],
    order: [["month", "ASC"]],
  });

  if (data.length < 2) return 0;

  const first = parseFloat(data[0].dataValues.total);
  const last = parseFloat(data[data.length - 1].dataValues.total);

  return first !== 0 ? ((last - first) / first) * 100 : 0;
};

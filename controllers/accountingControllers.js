const Client = require("../models/Client");
const Transaction = require("../models/Transaction");
const sequelize = require("sequelize");

exports.getStatistics = async (req, res) => {
  try {
    const exchangeRates = { CUP: 0.04, MLC: 1, USD: 1 }; // Example exchange rates to USD

    const transactions = await Transaction.findAll();

    const totalRevenue = { CUP: 0, MLC: 0, USD: 0 };
    const totalExpenses = { CUP: 0, MLC: 0, USD: 0 };
    const revenueByClient = {};
    const expensesByClient = {};
    const monthlyRevenue = {};
    const monthlyExpenses = {};

    transactions.forEach((transaction) => {
      const {
        Amount_charged,
        Currency,
        Type_of_transaction,
        ClientID,
        createdAt,
      } = transaction;

      if (Type_of_transaction === "ADD") {
        totalRevenue[Currency] += Amount_charged;
        if (!revenueByClient[ClientID])
          revenueByClient[ClientID] = { CUP: 0, MLC: 0, USD: 0 };
        revenueByClient[ClientID][Currency] += Amount_charged;

        const month = createdAt.toISOString().slice(0, 7);
        if (!monthlyRevenue[month])
          monthlyRevenue[month] = { CUP: 0, MLC: 0, USD: 0 };
        monthlyRevenue[month][Currency] += Amount_charged;
      } else if (Type_of_transaction === "EXPENSE") {
        totalExpenses[Currency] += Amount_charged;
        if (!expensesByClient[ClientID])
          expensesByClient[ClientID] = { CUP: 0, MLC: 0, USD: 0 };
        expensesByClient[ClientID][Currency] += Amount_charged;

        const month = createdAt.toISOString().slice(0, 7);
        if (!monthlyExpenses[month])
          monthlyExpenses[month] = { CUP: 0, MLC: 0, USD: 0 };
        monthlyExpenses[month][Currency] += Amount_charged;
      }
    });

    const netProfit = {
      CUP: totalRevenue.CUP - totalExpenses.CUP,
      MLC: totalRevenue.MLC - totalExpenses.MLC,
      USD: totalRevenue.USD - totalExpenses.USD,
    };

    const netProfitMargin = {
      CUP: totalRevenue.CUP ? (netProfit.CUP / totalRevenue.CUP) * 100 : 0,
      MLC: totalRevenue.MLC ? (netProfit.MLC / totalRevenue.MLC) * 100 : 0,
      USD: totalRevenue.USD ? (netProfit.USD / totalRevenue.USD) * 100 : 0,
    };

    // Fetch clients without Admin role
    const nonAdminClients = await Client.count({
      where: {
        role: {
          [sequelize.Op.ne]: "Admin",
        },
      },
    });

    const averageRevenuePerUser = {
      CUP: nonAdminClients ? totalRevenue.CUP / nonAdminClients : 0,
      MLC: nonAdminClients ? totalRevenue.MLC / nonAdminClients : 0,
      USD: nonAdminClients ? totalRevenue.USD / nonAdminClients : 0,
    };

    const revenueGrowthRate = await calculateGrowthRate(
      Transaction,
      "Amount_charged",
      "ADD"
    );
    const expenseGrowthRate = await calculateGrowthRate(
      Transaction,
      "Amount_charged",
      "EXPENSE"
    );

    res.json({
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
    });
  } catch (error) {
    console.error("Error fetching accounting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateGrowthRate = async (model, field, type) => {
  const data = await model.findAll({
    attributes: [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
        "month",
      ],
      [sequelize.fn("SUM", sequelize.col(field)), "total"],
    ],
    where: { Type_of_transaction: type },
    group: ["month"],
    order: [["month", "ASC"]],
  });

  if (data.length < 2) return 0;

  const first = parseFloat(data[0].dataValues.total);
  const last = parseFloat(data[data.length - 1].dataValues.total);

  return first !== 0 ? ((last - first) / first) * 100 : 0;
};

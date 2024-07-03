const Transaction = require("../models/Transaction");
const Client = require("../models/Client");
const User = require("../models/User");
const Admin = require("../models/Admin");
const ExchangeRate = require("../models/ExchangeRate");
// READ ALL
exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.findAll();
  return res.json(transactions);
};

// READ ONE
exports.getTransaction = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({
    where: {
      TransactionID: id,
    },
  });
  if (transaction) {
    return res.json(transaction);
  } else {
    return res.status(404).json({ error: "Transaction not found" });
  }
};

// exports.getClientTransactions = async (req, res) => {
//   try {
//     const { clientEmail } = req.params;
//     console.log(clientEmail);
//     if (!clientEmail) {
//       return res.status(400).json({ message: "Bad request fields missing" });
//     }
//     if (clientEmail) {
//       const client = await Client.findOne({
//         where: { ClientEmail: clientEmail },
//       });

//       if (!client) {
//         return res.staus(404).json({
//           message: "Could not retrieve transactions, client not found",
//         });
//       }
//       if (client) {
//         const transactions = await Transaction.findAll({
//           where: { ClientID: client.ClientID },
//           attributes: {
//             exclude: ["TransactionID", "ClientID", "createdAt", "updatedAt"],
//           },
//         });
//         return res.json(transactions);
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     return res.status(500).json({ error: "Database error" });
//   }
// };

exports.createExpense = async (req, res) => {
  const adminEmail = req.user;
  const { amountCharged, description, currency } = req.body;
  if (adminEmail) {
    const admin = await User.findOne({ where: { Email: adminEmail } });
    if (admin) {
      const exchangeRate = await ExchangeRate.findOne({
        where: { Currency: currency },
      });
      if (!exchangeRate) {
        return res.status(400).json({ error: "Invalid currency" });
      }
      const expense = await Transaction.create({
        UserID: admin.UserID,
        TypeOfTransaction: "EXPENSE",
        AmountCharged: amountCharged,
        Currency: currency,
        CreditAmount: 1,
        Description: description,
        ExchangeRate: exchangeRate.Rate,
      });
      return res.status(201).json(expense);
    } else {
      return res.status(404).json({ message: "Admin not Found" });
    }
  }
};

// UPDATE
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const {
    amountCharged,
    creditAmount,
    currency,
    typeOfTransaction,
    exchangeRate,
    description,
  } = req.body;

  const updateFields = {};
  if (amountCharged) updateFields.AmountCharged = amountCharged;
  if (creditAmount) updateFields.CreditAmount = creditAmount;
  if (currency) updateFields.Currency = currency;
  if (typeOfTransaction) updateFields.TypeOfTransaction = typeOfTransaction;
  if (description) updateFields.Description = description;
  if (exchangeRate) updateFields.ExchangeRate = exchangeRate;

  const transaction = await Transaction.findByPk(id);
  if (transaction) {
    await transaction.update(updateFields);
    return res.status(204).json({
      message: "Transaction updated successfully",
    });
  }
  return res.status(500).json({ error: "Database error" });
};

// DELETE
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);
  if (transaction) {
    await transaction.destroy();
    return res.json({ message: "Transaction deleted" });
  } else {
    return res.status(404).json({ error: "Transaction not found" });
  }
};

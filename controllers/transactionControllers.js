const Transaction = require("../models/Transaction");
const Client = require("../models/Client");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findOne({
      where: {
        TransactionID: transactionId,
      },
    });
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getClientTransactions = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    console.log(clientEmail);
    if (!clientEmail) {
      res.status(400).json({ message: "Bad request fields missing" });
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });

      if (!client) {
        res.staus(404).json({
          message: "Could not retrieve transactions, client not found",
        });
      }
      if (client) {
        const transactions = await Transaction.findAll({
          where: { ClientID: client.ClientID },
          attributes: {
            exclude: ["TransactionID", "ClientID", "createdAt", "updatedAt"],
          },
        });
        res.json(transactions);
      }
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createExpense = async (req, res) => {
  try {
    console.log(req.body);
    const { ClientID, Amount_charged, Description, Currency } = req.body;
    const newTransaction = await Transaction.create({
      ClientID,
      Date: new Date(),
      Type_of_transaction: "EXPENSE",
      Amount_charged: Amount_charged,
      Currency,
      Credit_amount: 1,
      Description,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// exports.updateTransaction = async (req, res) => {
//   try {
//     const { transactionId } = req.params;
//     const {
//       ConsumerID,
//       MachineID,
//       AmountCharged,
//       CreditsAdded,
//       TransactionDate,
//     } = req.body;
//     const transaction = await Transaction.findByPk(transactionId);
//     if (transaction) {
//       transaction.ConsumerID = ConsumerID;
//       transaction.MachineID = MachineID;
//       transaction.AmountCharged = AmountCharged;
//       transaction.CreditsAdded = CreditsAdded;
//       transaction.TransactionDate = TransactionDate;
//       await transaction.save();
//       res.json(transaction);
//     } else {
//       res.status(404).json({ error: "Transaction not found" });
//     }
//   } catch (error) {
//     console.error("Error updating transaction:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

// exports.deleteTransaction = async (req, res) => {
//   try {
//     const { transactionId } = req.params;
//     const transaction = await Transaction.findByPk(transactionId);
//     if (transaction) {
//       await transaction.destroy();
//       res.json({ message: "Transaction deleted" });
//     } else {
//       res.status(404).json({ error: "Transaction not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

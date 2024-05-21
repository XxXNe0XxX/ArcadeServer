const Transaction = require("../models/Transaction");

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
    const transaction = await Transaction.findByPk(transactionId);
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

exports.createTransaction = async (req, res) => {
  try {
    const {
      ConsumerID,
      MachineID,
      AmountCharged,
      CreditsAdded,
      TransactionDate,
    } = req.body;
    const newTransaction = await Transaction.create({
      ConsumerID,
      MachineID,
      AmountCharged,
      CreditsAdded,
      TransactionDate,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const {
      ConsumerID,
      MachineID,
      AmountCharged,
      CreditsAdded,
      TransactionDate,
    } = req.body;
    const transaction = await Transaction.findByPk(transactionId);
    if (transaction) {
      transaction.ConsumerID = ConsumerID;
      transaction.MachineID = MachineID;
      transaction.AmountCharged = AmountCharged;
      transaction.CreditsAdded = CreditsAdded;
      transaction.TransactionDate = TransactionDate;
      await transaction.save();
      res.json(transaction);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findByPk(transactionId);
    if (transaction) {
      await transaction.destroy();
      res.json({ message: "Transaction deleted" });
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Database error" });
  }
};

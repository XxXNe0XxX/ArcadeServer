const Transaction = require("../models/Transaction");
const Client = require("../models/Client");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    return res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Database error" });
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
      return res.json(transaction);
    } else {
      return res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.getClientTransactions = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    console.log(clientEmail);
    if (!clientEmail) {
      return res.status(400).json({ message: "Bad request fields missing" });
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });

      if (!client) {
        return res.staus(404).json({
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
        return res.json(transactions);
      }
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    if (!clientEmail) {
      return res
        .status(400)
        .json({ message: "Bad request: Missing url params" });
    }
    const { Amount_charged, Description, Currency } = req.body.formData;
    if (!Amount_charged && !Description && !Currency) {
      return res.status(400).json({ message: "Bad request: Missing fields" });
    }
    const client = await Client.findOne({
      where: { ClientEmail: clientEmail },
      attributes: { exclude: ["ClientPassword"] },
    });
    if (!client) {
      res.status(404).json({ message: "Client not found" });
    }
    if (client) {
      const newTransaction = await Transaction.create({
        ClientID: client.ClientID,
        Date: new Date(),
        Type_of_transaction: "EXPENSE",
        Amount_charged: Amount_charged,
        Currency,
        Credit_amount: 1,
        Description,
      });
      return res.status(201).json(newTransaction);
    }
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.updateTransaction = async (req, res) => {
  console.log(req.body.formData);
  try {
    const { transactionId } = req.params;
    const {
      ClientID,
      Amount_charged,
      Credit_amount,
      Currency,
      Type_of_transaction,
      Description,
    } = req.body.formData;
    if (!transactionId) {
      return res
        .status(400)
        .json({ message: "Bad request. Missing url params" });
    }
    if (
      !ClientID &&
      !Amount_charged &&
      !Credit_amount &&
      !Currency &&
      !Type_of_transaction &&
      !Description
    ) {
      return res.status(400).json({ message: "Bad request. Missing fields" });
    }

    const updateFields = {};
    if (ClientID) updateFields.ClientID = ClientID;
    if (Amount_charged) updateFields.Amount_charged = Amount_charged;
    if (Credit_amount) updateFields.Credit_amount = Credit_amount;
    if (Currency) updateFields.Currency = Currency;
    if (Type_of_transaction)
      updateFields.Type_of_transaction = Type_of_transaction;
    if (Description) updateFields.Description = Description;

    const transaction = await Transaction.findByPk(transactionId);
    if (transaction) {
      await transaction.update(updateFields);
      return res.status(204).json({
        message: "Transaction updated successfully",
      });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findByPk(transactionId);
    if (transaction) {
      await transaction.destroy();
      return res.json({ message: "Transaction deleted" });
    } else {
      return res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

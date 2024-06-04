const Client = require("../models/Client");
const Transaction = require("../models/Transaction");
exports.addCredits = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { CreditAmount, AmountCharged, Currency } = req.body;
    const client = await Client.findByPk(clientId, {
      // attributes: ["Credit_balance", "ClientEmail", "ClientName"],
      attributes: { exclude: ["ClientPassword"] },
    });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    if (!client.active) {
      res.json({ message: "Client is not active" });
    }
    client.Credit_balance += CreditAmount;
    await client.save();

    const transaction = await Transaction.create({
      ClientID: clientId,
      Amount_charged: AmountCharged,
      Credit_amount: CreditAmount,
      Currency: Currency,
      Date: new Date(),
      Type_of_transaction: "ADD",
    });

    res.json({
      message: "Credits added successfully",
      balance: client.Credit_balance,
      transaction,
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.removeCredits = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { CreditAmount } = req.body;
    const client = await Client.findByPk(clientId, {
      // attributes: ["Credit_balance", "ClientEmail", "ClientName"],
      attributes: { exclude: ["ClientPassword"] },
    });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    client.Credit_balance -= CreditAmount;
    await client.save();

    const transaction = await Transaction.create({
      ClientID: clientId,
      Amount_charged: 0,
      Credit_amount: CreditAmount,
      Currency: "deducted",
      Date: new Date(),
      Type_of_transaction: "SUBTRACT",
    });

    res.json({
      message: "Credits removed successfully",
      balance: client.Credit_balance,
      transaction,
    });
  } catch (error) {
    console.error("Error removing credits:", error);
    res.status(500).json({ error: "Database error" });
  }
};

const Client = require("../models/Client");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Admin = require("../models/Admin");

exports.addCredits = async (req, res) => {
  const { id } = req.params;
  const { add, amount, currency } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!user.Active) {
    return res.json({ message: "User is not active" });
  }
  if (user.Role === "CLIENT") {
    const client = await Client.findOne({ where: { UserID: user.UserID } });
    if (client) {
      client.Credit_balance += +add;
      await client.save();
      const transaction = await Transaction.create({
        UserID: id,
        AmountCharged: amount,
        CreditAmount: add,
        Currency: currency,
        TypeOfTransaction: "ADD",
      });

      return res.json({
        message: "Credits added successfully",
        balance: client.Credit_balance,
        transaction,
      });
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  }
};

exports.removeCredits = async (req, res) => {
  const { id } = req.params;
  const { subtract } = req.body;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user && user.Role === "CLIENT") {
    const client = await Client.findOne({ where: { UserID: user.UserID } });
    if (client) {
      client.Credit_balance -= +subtract;
      await client.save();
      const transaction = await Transaction.create({
        UserID: id,
        AmountCharged: 0,
        CreditAmount: subtract,
        Currency: "DEDUCTED",
        TypeOfTransaction: "SUBTRACT",
      });
      return res.json({
        message: "Credits removed successfully",
        balance: client.Credit_balance,
        transaction,
      });
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  }
};

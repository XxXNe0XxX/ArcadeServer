const Client = require("../models/Client");
const QRCode = require("../models/QRCode");
const Transaction = require("../models/Transaction");
const GameSession = require("../models/GameSession");
const ArcadeMachine = require("../models/ArcadeMachine");

const { v4: uuidv4 } = require("uuid");
const QRCodeLib = require("qrcode");
exports.generateQR = async (req, res) => {
  try {
    const { email, creditAmount, amountCharged, currency } = req.body;
    if (!email || !creditAmount || !amountCharged || !currency) {
      return res.status(400).send("All fields are required");
    }
    if (amountCharged <= 0 || creditAmount <= 0) {
      res.status(400).json({
        message: "Amounts must be greater than 0",
      });
      return;
    }
    const client = await Client.findOne({ where: { ClientEmail: email } });
    if (client.Credit_balance < creditAmount) {
      res.status(404).json("Not enough credits to process the request");
      return;
    } else {
      client.Credit_balance -= creditAmount;
      await client.save();
    }
    const transaction = await Transaction.create({
      ClientID: client.ClientID,
      Amount_charged: amountCharged,
      Credit_amount: creditAmount,
      Currency: currency,
      Date: new Date(),
      Type_of_transaction: "SUBTRACT",
    });
    const identifier = uuidv4();

    const qr = await QRCodeLib.toDataURL(identifier);

    const qrCode = await QRCode.create({
      Identifier: identifier,
      QRBalance: creditAmount,
      ClientID: client.ClientID,
    });

    res.status(201).json({
      message: `QR code generated with ${creditAmount} credit(s)`,

      qrBalance: qrCode.QRBalance,
      qrCode: qr,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getQR = async (req, res) => {
  console.log(req.body);
  try {
    const { identifier } = req.body;
    if (!identifier) {
      res.status(400).json({ message: "identifier field missing" });
    }
    if (identifier) {
      const qr = await QRCode.findOne({
        where: { Identifier: identifier },
        attributes: { exclude: ["ClientId"] },
      });
      const qrCode = await QRCodeLib.toDataURL(identifier);
      if (!qr) {
        return res.status(404).json({ error: "qr code not found" });
      }
      res.json({ qrCode: qrCode, balance: qr.QRBalance });
    }
  } catch (error) {
    console.error("Error fetching qr:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.deleteQr = async (req, res) => {
  try {
    const { QRCodeId } = req.body;
    if (!QRCodeId) {
      res.status(400).json({ message: "Bad request: missing QRCodeId" });
    }
    const qr = await QRCode.findByPk(QRCodeId);
    if (!qr) {
      res.status(404).json({ message: "QR code not found" });
    }
    if (qr.QRBalance === 0) {
      res.status(401).json({ message: "The balance in the qr code is not 0" });
    }
    if (qr) {
      await qr.destroy();
      res.json({ message: "QR code successfully deleted" });
    }
  } catch (error) {
    console.error("Error deleting qr:", error);
    res.status(500).json({ error: "Database error" });
  }
};

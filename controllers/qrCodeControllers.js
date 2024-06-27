const Client = require("../models/Client");
const QRCode = require("../models/QRCode");
const Transaction = require("../models/Transaction");
const GameSession = require("../models/GameSession");
const ArcadeMachine = require("../models/ArcadeMachine");

const { v4: uuidv4 } = require("uuid");
const QRCodeLib = require("qrcode");
const User = require("../models/User");

exports.getAllQrs = async (req, res) => {
  const qrcodes = await QRCode.findAll();
  return res.status(200).json(qrcodes);
};

exports.generateQR = async (req, res) => {
  const email = req.user;
  const { creditAmount, amountCharged, currency } = req.body;
  if (!creditAmount || !amountCharged || !currency) {
    return res.status(400).send("All fields are required");
  }
  if (amountCharged <= 0 || creditAmount <= 0) {
    return res.status(400).json({
      message: "Amounts must be greater than 0",
    });
  }
  const user = await User.findOne({ where: { Email: email } });
  if (user) {
    const client = await Client.findOne({ where: { UserID: user.UserID } });
    if (client.Credit_balance < creditAmount) {
      return res.status(404).json("Not enough credits to process the request");
    } else {
      client.Credit_balance -= creditAmount;
      await client.save();
    }
    const transaction = await Transaction.create({
      UserID: client.UserID,
      AmountCharged: amountCharged,
      CreditAmount: creditAmount,
      Currency: currency,
      TypeOfTransaction: "SUBTRACT",
    });
    const identifier = uuidv4();

    const qr = await QRCodeLib.toDataURL(identifier);

    const qrCode = await QRCode.create({
      Identifier: identifier,
      QRBalance: creditAmount,
      ClientID: client.ClientID,
    });

    return res.status(201).json({
      message: `QR code generated with ${creditAmount} credit(s)`,

      qrBalance: qrCode.QRBalance,
      qrCode: qr,
      transaction,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

exports.getQR = async (req, res) => {
  console.log(req.body);
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "identifier field missing" });
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
      return res.json({ qrCode: qrCode, balance: qr.QRBalance });
    }
  } catch (error) {
    console.error("Error fetching qr:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.deleteQr = async (req, res) => {
  const { id } = req.params;
  const qr = await QRCode.findByPk(id);
  if (!qr) {
    return res.status(404).json({ message: "QR code not found" });
  }
  if (qr.QRBalance === 0) {
    return res
      .status(401)
      .json({ message: "The balance in the qr code is not 0" });
  }
  if (qr) {
    await qr.destroy();
    return res.json({ message: "QR code successfully deleted" });
  }
};

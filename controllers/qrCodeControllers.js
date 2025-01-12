const Client = require("../models/Client");
const QRCode = require("../models/QRCode");
const Transaction = require("../models/Transaction");
const GameSession = require("../models/GameSession");
const ArcadeMachine = require("../models/ArcadeMachine");
const ExchangeRate = require("../models/ExchangeRate");
const { v4: uuidv4 } = require("uuid");
const QRCodeLib = require("qrcode");
const User = require("../models/User");
const formatTimestamps = require("../utils/formatDate");

exports.getAllQrs = async (req, res) => {
  const qrcodes = await QRCode.findAll({
    include: {
      model: Client,
      attributes: ["UserID"],

      include: {
        model: User,
        attributes: ["Email"],
      },
    },
  });
  const formattedQrCodes = qrcodes.map((qr) => {
    const qrData = qr.toJSON();
    return {
      ...qrData,
      Client: { UserID: undefined },
      User: qrData.Client.User.Email,
      ClientID: undefined, // Remove ClientID field if needed
    };
  });

  return res.status(200).json(formatTimestamps(formattedQrCodes));
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
    const exchangeRate = await ExchangeRate.findOne({
      where: { Currency: currency },
    });
    if (!exchangeRate) {
      return res.status(400).json({ error: "Invalid currency" });
    }
    const transaction = await Transaction.create({
      UserID: client.UserID,
      AmountCharged: amountCharged,
      CreditAmount: creditAmount,
      Currency: currency,
      TypeOfTransaction: "SUBTRACT",
      ExchangeRate: exchangeRate.Rate,
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
exports.getQRById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id field missing" });
    }
    if (id) {
      const qr = await QRCode.findOne({
        where: { QRCodeID: id },
        attributes: { exclude: ["ClientId"] },
      });
      if (!id) {
        return res.status(404).json({ error: "qr code not found" });
      }
      return res.json(qr);
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
exports.editQr = async (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  const qr = await QRCode.findByPk(id);
  if (!qr) {
    return res.status(404).json({ message: "QR code not found" });
  }

  if (qr) {
    await qr.update({ QRBalance: balance });
    return res.status(204).json({
      message: "QR code balance updated successfully",
    });
  } else {
    return res.status(500).json({ error: "Database error" });
  }
};

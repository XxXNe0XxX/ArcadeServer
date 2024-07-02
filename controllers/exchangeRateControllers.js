const Client = require("../models/Client");
const QRCode = require("../models/QRCode");
const Transaction = require("../models/Transaction");
const GameSession = require("../models/GameSession");
const ArcadeMachine = require("../models/ArcadeMachine");
const ExchangeRate = require("../models/ExchangeRate");

exports.getExchangeRates = async (req, res) => {
  try {
    const rates = await ExchangeRate.findAll();
    return res.status(200).json(rates);
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/exchangeRateController.js

exports.updateExchangeRates = async (req, res) => {
  const rates = req.body; // The rates object with currency keys and their respective rates

  try {
    const updatePromises = Object.entries(rates).map(([currency, rate]) =>
      ExchangeRate.update({ Rate: rate }, { where: { Currency: currency } })
    );

    await Promise.all(updatePromises);

    return res
      .status(200)
      .json({ message: "Exchange rates updated successfully", updatePromises });
  } catch (error) {
    console.error("Error updating exchange rates:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getExchangeRatesWithCUPBase = async (req, res) => {
  try {
    const rates = await ExchangeRate.findAll();

    const ratesWithCUPBase = rates.map((rate) => {
      if (rate.Currency === "CUP") {
        return { ...rate.toJSON(), Rate: 1 };
      }
      return {
        ...rate.toJSON(),
        Rate: Math.floor(
          rate.Rate / rates.find((each) => each.Currency === "CUP").Rate
        ),
      };
    });

    return res.status(200).json(ratesWithCUPBase);
  } catch (error) {
    console.error("Error fetching exchange rates with CUP base:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

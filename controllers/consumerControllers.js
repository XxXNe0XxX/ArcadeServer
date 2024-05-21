const Consumer = require("../models/Consumer");
const Transaction = require("../models/Transaction");
const GameSession = require("../models/GameSession");
const ArcadeMachine = require("../models/ArcadeMachine");

exports.getConsumers = async (req, res) => {
  try {
    const consumers = await Consumer.findAll();
    res.json(consumers);
  } catch (error) {
    console.error("Error fetching consumers:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createConsumer = async (req, res) => {
  try {
    const { ConsumerName, ConsumerEmail, ConsumerBalance = 0 } = req.body;
    const existingConsumer = await Consumer.findOne({
      where: { ConsumerEmail },
    });
    if (existingConsumer) {
      return res
        .status(403)
        .json({ error: "A consumer with this email already exists" });
    }

    const newConsumer = await Consumer.create({
      ConsumerName,
      ConsumerEmail,
      ConsumerBalance,
    });
    res.status(201).json(newConsumer);
  } catch (error) {
    console.error("Error creating consumer:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.updateConsumer = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const { ConsumerName, ConsumerEmail, ConsumerBalance } = req.body;
    const consumer = await Consumer.findByPk(consumerId);
    if (consumer) {
      consumer.ConsumerName = ConsumerName;
      consumer.ConsumerEmail = ConsumerEmail;
      consumer.ConsumerBalance = ConsumerBalance;
      await consumer.save();
      res.json(consumer);
    } else {
      res.status(404).json({ error: "Consumer not found" });
    }
  } catch (error) {
    console.error("Error updating consumer:", error);
    res.status(500).json({ error: "Database error" });
  }
};
exports.deleteConsumer = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const consumer = await Consumer.findByPk(consumerId);
    if (consumer) {
      await consumer.destroy();
      res.json({ message: "Consumer deleted" });
    } else {
      res.status(404).json({ error: "Consumer not found" });
    }
  } catch (error) {
    console.error("Error deleting consumer:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getConsumer = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const consumer = await Consumer.findByPk(consumerId);
    if (consumer) {
      res.json(consumer);
    } else {
      res.status(404).json({ error: "Consumer not found" });
    }
  } catch (error) {
    console.error("Error fetching consumer:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Handle Credits
exports.addCredits = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const { credits } = req.body;
    const consumer = await Consumer.findByPk(consumerId);
    if (!consumer) {
      return res.status(404).json({ error: "Consumer not found" });
    }

    consumer.ConsumerBalance += credits;
    await consumer.save();

    const transaction = await Transaction.create({
      ConsumerID: consumerId,
      AmountCharged: 0,
      CreditsAdded: credits,
      TransactionDate: new Date(),
    });

    res.json({
      message: "Credits added successfully",
      balance: consumer.ConsumerBalance,
      transaction,
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Remove Credits

exports.removeCredits = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const { machineId, creditsUsed } = req.body;
    const consumer = await Consumer.findByPk(consumerId);
    if (!consumer) {
      return res.status(404).json({ error: "Consumer not found" });
    }

    const arcadeMachine = await ArcadeMachine.findByPk(machineId);
    if (!arcadeMachine) {
      return res.status(404).json({ error: "Arcade machine not found" });
    }

    if (consumer.ConsumerBalance < creditsUsed) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

    consumer.ConsumerBalance -= creditsUsed;
    await consumer.save();

    const gameSession = await GameSession.create({
      ConsumerID: consumerId,
      MachineID: machineId,
      CreditsUsed: creditsUsed,
      SessionDate: new Date(),
    });

    res.json({
      message: "Credits used successfully",
      balance: consumer.ConsumerBalance,
      gameSession,
    });
  } catch (error) {
    console.error("Error using credits:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Get Transactions
exports.getTransactions = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const transactions = await Transaction.findAll({
      where: { ConsumerID: consumerId },
      order: [["TransactionDate", "DESC"]],
    });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ error: "Database error" });
  }
};

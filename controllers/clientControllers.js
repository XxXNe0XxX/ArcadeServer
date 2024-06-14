const Client = require("../models/Client");
const bcrypt = require("bcrypt");
const ArcadeMachine = require("../models/ArcadeMachine");
const Transaction = require("../models/Transaction");
const GameSession = require("../models/GameSession");
const { Sequelize } = require("sequelize");
const QRCode = require("../models/QRCode");
// Starts here

// OK
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      // Exclude the password attribute from the result
      attributes: { exclude: ["ClientPassword"] },
    });
    res.json(clients);
    if (!clients) {
      return res.json({ message: "No Clients found" });
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// OK
exports.createClient = async (req, res) => {
  console.log(req.body.formData);
  try {
    const { name, password, email, address, contact } = req.body.formData;
    if (!name && !password && !email && !address && !contact) {
      return res
        .status(400)
        .json({ message: "Bad request: All fields are required" });
    }
    const duplicate = await Client.findOne({
      where: { ClientEmail: email },
    });
    if (duplicate) {
      return res
        .status(409)
        .json({ message: "A client with that email already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Salt Rounds

    const newClient = await Client.create({
      ClientName: name,
      ClientAddress: address,
      ClientContact: contact,
      ClientEmail: email,
      ClientPassword: hashedPassword,
      active: true,
      role: "Client",
    });
    res.status(201).json({
      message: `The client with email: ${newClient.ClientEmail} was created`,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// OK
exports.getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);

    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getClient = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    const client = await Client.findOne({
      where: { ClientEmail: clientEmail },

      attributes: { exclude: ["ClientPassword", "ClientID"] },
    });

    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// OK
exports.updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, address, contact, email } = req.body.formData;
    if (!name && !address && !contact && !email) {
      return res.status(400).json({ error: "Bad request" });
    }
    if (!clientId) {
      return res.status(400).json({ error: "Missing url params" });
    }
    const client = await Client.findByPk(clientId);

    const updateFields = {};
    if (name) updateFields.ClientName = name;
    if (address) updateFields.ClientAddress = address;
    if (contact) updateFields.ClientContact = contact;
    if (email) updateFields.ClientEmail = email;
    if (email) {
      const duplicate = await Client.findOne({
        where: { ClientEmail: email },
      });
      if (duplicate) {
        return res
          .status(409)
          .json({ message: "A client with that email already exist" });
      }
    }
    if (client) {
      await client.update(updateFields);
      res.json({ message: `Client ${client.ClientEmail} updated` });
    } else {
      return res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({ error: "Database error" });
  }
};

// OK
exports.deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);
    if (client) {
      await client.destroy();
      res.json({ message: "Client deleted" });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.deactivateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);
    if (client) {
      client.active = 0;
      await client.save();
      res.json({ message: "Client deactivated" });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    console.error("Error deactivating client:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Client Queries

exports.changePassword = async (req, res) => {
  const { clientEmail } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the client by email
    const client = await Client.findOne({ where: { clientEmail } });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      client.ClientPassword
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    client.ClientPassword = hashedPassword;
    await client.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMachines = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    if (!clientEmail) {
      res.status(400).json("Missing url params");
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });
      if (!client) {
        res.status(404).json({ message: "Client not found" });
      }
      const clientId = client.ClientID;
      const machines = await ArcadeMachine.findAll({
        where: { ClientID: clientId },
      });
      res.status(200).json({ machines: machines });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getBalance = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    if (!clientEmail) {
      res.status(400).json("Missing url params");
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });
      if (!client) {
        res.status(404).json({ message: "Client not found" });
      }

      res.status(200).json({ balance: client.Credit_balance });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getProfits = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    if (!clientEmail) {
      res.status(400).json("Missing url params");
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });
      if (!client) {
        res.status(404).json({ message: "Client not found" });
      }

      const clientId = client.ClientID;
      const currencies = ["MLC", "CUP", "USD"];
      const totals = {};
      for (const currency of currencies) {
        const total = await Transaction.sum("Amount_charged", {
          where: {
            ClientID: clientId,
            Type_of_transaction: "SUBTRACT",
            Currency: currency,
          },
        });
        totals[currency] = total || 0; // Ensure zero if there are no transactions
      }
      res.status(200).json({ totals });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    if (!clientEmail) {
      res.status(400).json("Missing url params");
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });
      if (!client) {
        res.status(404).json({ message: "Client not found" });
      }
      const clientId = client.ClientID;
      const currencies = ["MLC", "CUP", "USD"];
      const totals = {};

      for (const currency of currencies) {
        const total = await Transaction.sum("Amount_charged", {
          where: {
            ClientID: clientId,
            Type_of_transaction: "ADD",
            Currency: currency,
          },
        });
        totals[currency] = total || 0; // Ensure zero if there are no transactions
      }

      res.status(200).json({ totals });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// FIX ME
exports.getGameSessions = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    if (!clientEmail) {
      res.status(400).json("Missing url params");
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });
      if (!client) {
        res.status(404).json({ message: "Client not found" });
      }
      const machines = await ArcadeMachine.findAll({
        where: { ClientID: client.ClientID },
      });
      if (!machines) {
        res.status(404).json({ message: "Machines not found" });
      }
      const machineIds = machines.map((machine) => machine.MachineID);
      const gameSessions = await GameSession.findAll({
        where: { MachineID: machineIds },
        attributes: {
          exclude: ["SessionID", "createdAt", "updatedAt", "MachineID"],
        },
      });

      if (gameSessions.length === 0) {
        return res.status(404).json({ message: "Sessions not found" });
      }

      res.status(200).json(gameSessions);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMachineUsageStatistics = async (req, res) => {
  try {
    const { clientEmail } = req.params;

    if (!clientEmail) {
      return res
        .status(400)
        .json({ message: "Missing URL parameter: clientEmail" });
    }

    // Fetch the client to ensure they exist
    const client = await Client.findOne({
      where: { ClientEmail: clientEmail },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Fetch the machines associated with the client
    const machines = await ArcadeMachine.findAll({
      where: { ClientID: client.ClientID },
    });

    if (machines.length === 0) {
      return res.status(404).json({ message: "Machines not found" });
    }

    // Define the date ranges for MySQL
    const startOfDay = Sequelize.literal("CURDATE()");
    const startOfWeek = Sequelize.literal(
      "DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)"
    );
    const startOfMonth = Sequelize.literal(
      "DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE()) - 1 DAY)"
    );
    const startOfYear = Sequelize.literal(
      "DATE_SUB(CURDATE(), INTERVAL DAYOFYEAR(CURDATE()) - 1 DAY)"
    );

    const statistics = await Promise.all(
      machines.map(async (machine) => {
        const dailyUsage = await GameSession.count({
          where: {
            MachineID: machine.MachineID,
            createdAt: { [Sequelize.Op.gte]: startOfDay },
          },
        });

        const weeklyUsage = await GameSession.count({
          where: {
            MachineID: machine.MachineID,
            createdAt: { [Sequelize.Op.gte]: startOfWeek },
          },
        });

        const monthlyUsage = await GameSession.count({
          where: {
            MachineID: machine.MachineID,
            createdAt: { [Sequelize.Op.gte]: startOfMonth },
          },
        });

        const yearlyUsage = await GameSession.count({
          where: {
            MachineID: machine.MachineID,
            createdAt: { [Sequelize.Op.gte]: startOfYear },
          },
        });

        return {
          machineId: machine.MachineID,
          machineName: machine.Game, // Adjust according to your model
          dailyUsage,
          weeklyUsage,
          monthlyUsage,
          yearlyUsage,
        };
      })
    );

    // Return the aggregated results
    res.status(200).json(statistics);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getQrCodes = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    if (!clientEmail) {
      res.status(400).json("Missing url params");
    }
    if (clientEmail) {
      const client = await Client.findOne({
        where: { ClientEmail: clientEmail },
      });
      if (!client) {
        res.status(404).json({ message: "Client not found" });
      }
      const qrCodes = await QRCode.findAll({
        where: { ClientID: client.ClientID },
      });
      if (!qrCodes) {
        res.status(404).json({ message: "QR codes not found" });
      }
      res.status(200).json(qrCodes);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

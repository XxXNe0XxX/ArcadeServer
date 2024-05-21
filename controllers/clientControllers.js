const Client = require("../models/Client");

// Starts here
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createClient = async (req, res) => {
  try {
    const { ClientName, ClientAddress, ClientContact } = req.body;
    const newClient = await Client.create({
      ClientName,
      ClientAddress,
      ClientContact,
    });
    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);
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

exports.updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { ClientName, ClientAddress, ClientContact } = req.body;
    const client = await Client.findByPk(clientId);
    if (client) {
      client.ClientName = ClientName;
      client.ClientAddress = ClientAddress;
      client.ClientContact = ClientContact;
      await client.save();
      res.json(client);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Database error" });
  }
};

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

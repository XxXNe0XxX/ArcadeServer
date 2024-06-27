const User = require("../models/User");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const Technician = require("../models/Technician");
const Client = require("../models/Client");

//CREATE
exports.createUser = async (req, res) => {
  const {
    name,
    lastName,
    password,
    email,
    address,
    contact,
    province,
    municipality,
    role,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // Salt Rounds

  const newUser = await User.create({
    Name: name,
    LastName: lastName,
    Address: address,
    Province: province,
    Municipality: municipality,
    Contact: contact,
    Email: email,
    Password: hashedPassword,
    Active: true,
    Role: role || "CLIENT",
  });

  if (newUser.Role === "CLIENT") {
    const newClient = await Client.create({
      Credit_balance: 0,
      UserID: newUser.UserID,
    });
  }
  if (newUser.Role === "TECHNICIAN") {
    const newTechnician = await Technician.create({ UserID: newUser.UserID });
  }
  res.status(201).json({
    message: `The user with email: ${newUser.Email} was created`,
  });
};

// READ ALL
exports.getUsers = async (req, res) => {
  const users = await User.findAll({
    // Exclude the password attribute from the result
    attributes: { exclude: ["Password"] },
  });
  if (!users) {
    return res.json({ message: "No se encontro ningun usuario" });
  }
  return res.json(users);
};

// READ ONE
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, {
    attributes: {
      exclude: ["Password"],
    },
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

// UPDATE
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    lastName,
    address,
    contact,
    province,
    municipality,
    email,
    role,
  } = req.body;
  const user = await User.findByPk(id);

  const updateFields = {};
  if (name) updateFields.Name = name;
  if (lastName) updateFields.LastName = lastName;
  if (address) updateFields.Address = address;
  if (contact) updateFields.Contact = contact;
  if (email) updateFields.Email = email;
  if (municipality) updateFields.Municipality = municipality;
  if (province) updateFields.Province = province;
  if (role) updateFields.Role = role;

  if (user) {
    await User.update(updateFields, {
      where: {
        UserID: id,
      },
    });
    res.json({ message: ` ${user.Email} updated` });
  } else {
    return res.status(404).json({ error: " not found" });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    // Manually delete related records
    user.Role === "CLIENT" && (await Client.destroy({ where: { UserId: id } }));
    // Add other related models as necessary
    user.Role === "TECHNICIAN" &&
      (await Technician.destroy({ where: { UserID: id } }));

    await user.destroy();
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

// READ USER INFO
exports.getUserInfo = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findOne({
    where: { UserID: id },
    include: [
      {
        model: User,
        attributes: ["Email", "Name"],
      },
    ],
  });
  if (client) {
    return res.json(client);
  } else {
    return res.status(404).json({ message: "Client not found" });
  }
};

// TOGGLE
exports.toggleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    user.Active = !user.Active;
    await user.save();
    res.json({
      status: `${user.Active ? "activated" : "deactivated"}`,
      message: `User ${user.Active ? "activated" : "deactivated"}`,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

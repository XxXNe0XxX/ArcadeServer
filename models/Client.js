const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Client = sequelize?.define(
  "Client",
  {
    ClientID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ClientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ClientAddress: {
      type: DataTypes.TEXT,
    },
    ClientContact: {
      type: DataTypes.STRING,
    },
    ClientPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ClientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
  },
  {
    tableName: "Clients",
  }
);

module.exports = Client;

// models/ExchangeRate.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ExchangeRate = sequelize.define(
  "ExchangeRate",
  {
    RateID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "ExchangeRates",
    timestamps: true,
  }
);

module.exports = ExchangeRate;

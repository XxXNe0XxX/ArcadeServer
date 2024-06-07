const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Client = require("./Client");

const Transaction = sequelize.define(
  "Transaction",
  {
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Amount_charged: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value < 0) {
            throw new Error("AmountCharged must be a positive value");
          }
        },
      },
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Credit_amount: {
      type: DataTypes.INTEGER,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("AmountCharged must be a positive value");
          }
        },
      },
    },
    Type_of_transaction: {
      type: DataTypes.ENUM,
      values: ["ADD", "SUBTRACT"],
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Transactions",
  }
);

Transaction.belongsTo(Client, { foreignKey: "ClientID" });

module.exports = Transaction;

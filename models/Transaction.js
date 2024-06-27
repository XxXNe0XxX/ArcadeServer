const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Client = require("./Client");
const User = require("./User.js");

const Transaction = sequelize.define(
  "Transaction",
  {
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    AmountCharged: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value < 0) {
            throw new Error("Amount_charged must be a positive value");
          }
        },
      },
    },
    Currency: {
      type: DataTypes.ENUM,
      values: ["MLC", "USD", "CUP", "DEDUCTED"],
      allowNull: false,
    },
    CreditAmount: {
      type: DataTypes.INTEGER,
      validate: {
        isPositive(value) {
          if (value < 0) {
            throw new Error("Credit_amount must be a positive value");
          }
        },
      },
      allowNull: false,
    },
    TypeOfTransaction: {
      type: DataTypes.ENUM,
      values: ["ADD", "SUBTRACT", "EXPENSE"],
      allowNull: false,
    },

    Description: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Transactions",
    timestamps: true,
  }
);

Transaction.belongsTo(User, { foreignKey: "UserID" });

module.exports = Transaction;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Consumer = require("./Consumer");
const ArcadeMachine = require("./ArcadeMachine");

const Transaction = sequelize.define(
  "Transaction",
  {
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    AmountCharged: {
      type: DataTypes.DECIMAL(10, 2),
    },
    CreditsAdded: {
      type: DataTypes.DECIMAL(10, 2),
    },
    TransactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Transactions",
  }
);

Transaction.belongsTo(Consumer, { foreignKey: "ConsumerID" });
Transaction.belongsTo(ArcadeMachine, { foreignKey: "MachineID" });

module.exports = Transaction;

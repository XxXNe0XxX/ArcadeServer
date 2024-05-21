const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Consumer = sequelize.define(
  "Consumer",
  {
    ConsumerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ConsumerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ConsumerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ConsumerBalance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    tableName: "Consumers",
  }
);

module.exports = Consumer;

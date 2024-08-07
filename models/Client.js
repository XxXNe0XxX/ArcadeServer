const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Client = sequelize?.define(
  "Client",
  {
    ClientID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Credit_balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "UserID",
      },
      allowNull: false,
    },
  },
  {
    tableName: "Clients",
    timestamps: true,
    indexes: [
      {
        fields: ["UserID"], // Adding an index on the UserID field
      },
    ],
  }
);

Client.belongsTo(User, { foreignKey: "UserID" });

module.exports = Client;

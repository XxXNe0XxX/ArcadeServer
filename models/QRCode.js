const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const Client = require("./Client");

const QRCode = sequelize.define(
  "QRCode",
  {
    QRCodeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    QRBalance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "QRCodes",
    timestamps: true,
    indexes: [
      {
        fields: ["ClientID"], // Adding an index on the ClientID field
      },
    ],
  }
);

QRCode.belongsTo(Client, { foreignKey: "ClientID" });

module.exports = QRCode;

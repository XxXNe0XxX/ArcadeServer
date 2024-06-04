const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const QRCode = require("./QRCode");
const ArcadeMachine = require("./ArcadeMachine");

const GameSession = sequelize.define(
  "GameSession",
  {
    SessionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "GameSessions",
  }
);

GameSession.belongsTo(QRCode, { foreignKey: "QRCodeID" });
GameSession.belongsTo(ArcadeMachine, { foreignKey: "MachineID" });

module.exports = GameSession;

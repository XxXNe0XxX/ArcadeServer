const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Consumer = require("./Consumer");
const ArcadeMachine = require("./ArcadeMachine");

const GameSession = sequelize.define(
  "GameSession",
  {
    SessionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CreditsUsed: {
      type: DataTypes.DECIMAL(5, 2),
    },
    SessionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "GameSessions",
  }
);

GameSession.belongsTo(Consumer, { foreignKey: "ConsumerID" });
GameSession.belongsTo(ArcadeMachine, { foreignKey: "MachineID" });

module.exports = GameSession;

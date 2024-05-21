const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Client = require("./Client");

const ArcadeMachine = sequelize.define(
  "ArcadeMachine",
  {
    MachineID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MachineLocation: {
      type: DataTypes.TEXT,
    },
    GameName: {
      type: DataTypes.STRING,
    },
    CreditsPerGame: {
      type: DataTypes.DECIMAL(5, 2),
    },
  },
  {
    tableName: "ArcadeMachines",
  }
);

ArcadeMachine.belongsTo(Client, { foreignKey: "ClientID" });

module.exports = ArcadeMachine;
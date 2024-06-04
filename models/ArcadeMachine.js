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
    Game: {
      type: DataTypes.STRING,
    },
    CreditsPerGame: {
      type: DataTypes.INTEGER,
    },
    Running: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "ArcadeMachines",
  }
);

ArcadeMachine.belongsTo(Client, { foreignKey: "ClientID" });

module.exports = ArcadeMachine;

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
    Location: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "ArcadeMachines",
    timestamps: true,
    indexes: [
      {
        fields: ["ClientID"], // Adding an index on the ClientID field
      },
    ],
  }
);

ArcadeMachine.belongsTo(Client, { foreignKey: "ClientID" });

module.exports = ArcadeMachine;

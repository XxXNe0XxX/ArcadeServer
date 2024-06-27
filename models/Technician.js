const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Technician = sequelize?.define(
  "Technician",
  {
    TechnicianID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: "Technicians",
    timestamps: true, // This enables the automatic management of createdAt and updatedAt fields
  }
);

Technician.belongsTo(User, { foreignKey: "UserID" });

module.exports = Technician;

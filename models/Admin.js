const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Admin = sequelize?.define(
  "Admin",
  {
    AdminID: {
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
    tableName: "Admins",
    timestamps: true, // This enables the automatic management of createdAt and updatedAt fields
  }
);

Admin.belongsTo(User, { foreignKey: "UserID" });

module.exports = Admin;

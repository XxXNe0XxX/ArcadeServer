const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// List of regions for each province
const { regions } = require("../data/regions");

const User = sequelize?.define(
  "User",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Municipality: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isInRegions(value) {
          if (this.UserProvince && regions[this.UserProvince]) {
            if (!regions[this.UserProvince].includes(value)) {
              throw new Error(
                `UserCity must be one of: ${regions[this.UserProvince].join(
                  ", "
                )}`
              );
            }
          }
        },
      },
    },
    Province: {
      type: DataTypes.ENUM,
      values: Object.keys(regions),
      allowNull: false,
    },
    Contact: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    Role: {
      type: DataTypes.ENUM,
      values: ["ADMIN", "CLIENT", "TECHNICIAN"],
      allowNull: false,
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    timestamps: true, // This enables the automatic management of createdAt and updatedAt fields
  }
);

module.exports = User;

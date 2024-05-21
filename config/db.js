const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    loggin: console.log,
  }
);
const authenticateDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("----Connection to DB established successfully----");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
async function syncDatabase() {
  try {
    await sequelize?.sync();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

module.exports = { sequelize, authenticateDb, syncDatabase };

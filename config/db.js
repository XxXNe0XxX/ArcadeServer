const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const createDatabase = async () => {
  const connection = await mysql.createConnection(
    // {
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // }
    process.env.MYSQL_URL
  );

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
  );
  await connection.end();
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
    timezone: "America/Havana", // Set timezone to Cub
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

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

const initializeDatabase = async () => {
  await createDatabase();
  await authenticateDb();
  await syncDatabase();
};

module.exports = {
  sequelize,
  authenticateDb,
  syncDatabase,
  initializeDatabase,
};

// Call initializeDatabase to create the database and synchronize models
initializeDatabase();

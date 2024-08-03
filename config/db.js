const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialectOptions: {
    useUTC: true,
  },
});
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql",
//     logging: console.log,
//     timezone: "America/Havana", // Use UTC timezone to avoid issues
//   }
// );
const createDatabase = async () => {
  const databaseUrl = process.env.MYSQL_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not defined.");
  }
  try {
    const connection = await mysql.createConnection(
      // {
      // host: process.env.DB_HOST,
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // }
      databaseUrl
    );

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    await connection.end();
  } catch (error) {
    console.log(error);
  }
};

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
  try {
    await createDatabase();
    await authenticateDb();
    await syncDatabase();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sequelize,
  authenticateDb,
  syncDatabase,
  initializeDatabase,
};

// Call initializeDatabase to create the database and synchronize models
initializeDatabase();

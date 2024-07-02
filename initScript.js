const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function createFirstAdmin() {
  const connection = await mysql.createConnection(
    process.env.MYSQL_URL
    // {
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // }
  );

  try {
    // Check if the user already exists
    const [existingUser] = await connection.execute(
      `SELECT * FROM Users WHERE Email = ?`,
      ["admin@gmail.com"]
    );

    if (existingUser.length > 0) {
      console.log("Admin user already exists.");
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const [rows] = await connection.execute(
      `INSERT INTO Users (Name, LastName, Address, Municipality, Province, Contact, Email, Password, Role, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Neo",
        "X",
        "Calle Neo",
        "Santa Clara",
        "Villa Clara",
        "53111111",
        "admin@gmail.com",
        await bcrypt.hash("admin", 10),
        "admin",
        formattedDate,
        formattedDate,
      ]
    );

    const userId = rows.insertId;

    await connection.execute(
      `INSERT INTO Admins (UserID, createdAt, updatedAt)
             VALUES (?, ?, ?)`,
      [userId, formattedDate, formattedDate]
    );

    console.log("First admin created successfully.");
  } catch (error) {
    console.error("Error creating first admin:", error);
  } finally {
    await connection.end();
  }
}

module.exports = { createFirstAdmin };

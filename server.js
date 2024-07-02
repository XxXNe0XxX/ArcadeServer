require("dotenv").config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP
const express = require("express");
const cors = require("cors");
const app = express();
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const { authenticateDb, syncDatabase } = require("./config/db");
// index.js or server.js
require("./services/fetchExchangeRates");
const { createFirstAdmin } = require("./initScript");
createFirstAdmin();
// const { fetchExchangeRates } = require("./services/exchangeRateService");
// fetchExchangeRates();
const corsOptions = require("./config/corsOptions");
// Turned off for development

//Middleware
app.use(logger);
app.use(express.json()); // parse json bodies in the request object
app.use(cookieParser());
app.use(cors(corsOptions)); // Add corsOptions
// Import routes

const authRoutes = require("./routes/authRoutes");

const clientRoutes = require("./routes/clientRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const arcadeMachineRoutes = require("./routes/arcadeMachineRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const gameSessionRoutes = require("./routes/gameSessionRoutes");
const creditRoutes = require("./routes/creditRoutes");
const accountingRoutes = require("./routes/accountingRoutes");
const emailRoutes = require("./routes/emailRoutes");
const userRoutes = require("./routes/userRoutes");
const exchangeRateRoutes = require("./routes/exchangeRateRoutes");

app.use("/auth", authRoutes);

app.use("/api/client", clientRoutes);
app.use("/api/qrCodes", qrCodeRoutes);
app.use("/api/arcademachines", arcadeMachineRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/gamesessions", gameSessionRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/qr", qrCodeRoutes);
app.use("/api/accounting", accountingRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exchange", exchangeRateRoutes);

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong",
  });
});

// Listen on port
const PORT = process.env.PORT || 3000;
// const HOST = process.env.NETWORKHOST || "localhost";
app.use(errorHandler);

try {
  authenticateDb().then(
    syncDatabase().then(
      app.listen(PORT, () => {
        console.log(`----Server running on :${PORT}----`);
      })
    )
  );
} catch (error) {
  console.log(error);
}

// cronJobs/fetchExchangeRatesJob.js
const cron = require("node-cron");
const { fetchExchangeRates } = require("./exchangeRateService");

// Schedule the job to run every hour
cron.schedule("0 * * * *", fetchExchangeRates);

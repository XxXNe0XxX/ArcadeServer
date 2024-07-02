// services/exchangeRateService.js
const axios = require("axios");
const ExchangeRate = require("../models/ExchangeRate");
const cheerio = require("cheerio");
const URL = "https://eltoque.com/";

const fetchExchangeRates = async () => {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const rates = {};
    let usdRate = 0;

    // Parse the exchange rates from the table rows
    $("tr").each((index, element) => {
      const currencyText = $(element).find("span.currency").text().trim();
      const rateText = $(element).find("span.price-text").text().trim();
      const rate = parseFloat(rateText.replace(",", "."));

      if (currencyText && !isNaN(rate)) {
        const currency = currencyText.split(" ")[1]; // Extract currency code
        rates[currency] = rate;
        if (currency === "USD") {
          usdRate = rate;
        }
      }
    });

    if (!usdRate) {
      throw new Error("USD rate not found");
    }

    // Convert all rates to be based on the USD rate
    for (const currency in rates) {
      rates[currency] = rates[currency] / usdRate;
    }

    // Add the CUP currency with rate based on USD rate
    rates["CUP"] = 1 / usdRate;

    // Save or update rates in the database
    for (const currency in rates) {
      await ExchangeRate.upsert({
        Currency: currency,
        Rate: rates[currency],
      });
    }
    console.log("Exchange rates updated successfully", rates);
  } catch (error) {
    console.error("Error scraping exchange rates:", error);
  }
};

module.exports = { fetchExchangeRates };

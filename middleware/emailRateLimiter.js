const rateLimit = require("express-rate-limit");

const { logEvents } = require("./logger");

// Define the rate limit rule
const emailRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 2 requests per windowMs
  message: "Too many requests from this IP, please try again after 30 minutes",
  headers: true,
  handler: (req, res, next, options) => {
    logEvents(
      `Too many request:${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = emailRateLimiter;

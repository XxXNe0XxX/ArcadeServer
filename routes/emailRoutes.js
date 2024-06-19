const express = require("express");
const emailControllers = require("../controllers/emailControllers");
const router = express.Router();
const emailRateLimiter = require("../middleware/emailRateLimiter");

router.post("/send-email", emailRateLimiter, emailControllers.sendEmail);

module.exports = router;

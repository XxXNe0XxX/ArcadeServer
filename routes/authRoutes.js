const express = require("express");
const authControllers = require("../controllers/authControllers");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authControllers.login);
router.get("/refresh", authControllers.refresh);
router.post("/logout", authControllers.logout);

module.exports = router;

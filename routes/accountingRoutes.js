const express = require("express");
const accountingControllers = require("../controllers/accountingControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", verifyJWT(["ADMIN"]), accountingControllers.getStatistics);

module.exports = router;

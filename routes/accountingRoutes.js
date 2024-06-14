const express = require("express");
const accountingControllers = require("../controllers/accountingControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", verifyJWT(["Admin"]), accountingControllers.getStatistics);

module.exports = router;

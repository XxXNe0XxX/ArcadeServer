const express = require("express");
const accountingControllers = require("../controllers/accountingControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");
router.get(
  "/",
  verifyJWT(["ADMIN"]),
  asyncHandler(accountingControllers.getStatistics)
);

module.exports = router;

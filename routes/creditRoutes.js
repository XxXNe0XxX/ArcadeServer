const express = require("express");
const creditControllers = require("../controllers/creditControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { validateAddCredits } = require("../middleware/validateAddCredits");
const {
  validateRemoveCredits,
} = require("../middleware/validateRemoveCredits");
const validateParams = require("../middleware/validateParams");

router.post(
  "/add/:id",
  verifyJWT(["ADMIN"]),
  validateAddCredits,
  validateParams,
  creditControllers.addCredits
);
router.post(
  "/remove/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  validateRemoveCredits,
  creditControllers.removeCredits
);

module.exports = router;

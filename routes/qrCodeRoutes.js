const express = require("express");
const qrCodeControllers = require("../controllers/qrCodeControllers");
const router = express.Router();
const validateIdentifier = require("../middleware/validateIdentifier");
const verifyJWT = require("../middleware/verifyJWT");
router.post(
  "/generate",
  verifyJWT(["Admin", "Client"]),
  qrCodeControllers.generateQR
);
router.post("/get", validateIdentifier, qrCodeControllers.getQR);
router.delete("/delete", verifyJWT(["Admin"]), qrCodeControllers.deleteQr);

module.exports = router;

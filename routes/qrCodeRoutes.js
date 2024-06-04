const express = require("express");
const qrCodeControllers = require("../controllers/qrCodeControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
router.post(
  "/generate",
  verifyJWT(["Admin", "Client"]),
  qrCodeControllers.generateQR
);
router.post("/get", qrCodeControllers.getQR);
router.delete("/delete", verifyJWT(["Admin"]), qrCodeControllers.deleteQr);

module.exports = router;

const express = require("express");
const qrCodeControllers = require("../controllers/qrCodeControllers");
const router = express.Router();
const validateIdentifier = require("../middleware/validateIdentifier");
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");
const validateParams = require("../middleware/validateParams");

router.get(
  "/",
  verifyJWT(["ADMIN"]),
  asyncHandler(qrCodeControllers.getAllQrs)
);

router.post(
  "/generate",
  verifyJWT(["ADMIN", "CLIENT"]),
  asyncHandler(qrCodeControllers.generateQR)
);
router.post(
  "/recover",
  validateIdentifier,
  asyncHandler(qrCodeControllers.getQR)
);
router.delete(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(qrCodeControllers.deleteQr)
);

module.exports = router;

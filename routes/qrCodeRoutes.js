const express = require("express");
const qrCodeControllers = require("../controllers/qrCodeControllers");
const router = express.Router();
const validateIdentifier = require("../middleware/validateIdentifier");
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");
const validateParams = require("../middleware/validateParams");
const { validateAddCredits } = require("../middleware/validateAddCredits");
const { validateGenerateQr } = require("../middleware/validateGenerateQr");

router.get(
  "/",
  verifyJWT(["ADMIN"]),
  asyncHandler(qrCodeControllers.getAllQrs)
);
router.get(
  "/:id",
  verifyJWT(["ADMIN"]),
  asyncHandler(qrCodeControllers.getQRById)
);

router.post(
  "/generate",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateGenerateQr,
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
router.patch(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(qrCodeControllers.editQr)
);

module.exports = router;

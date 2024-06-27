const express = require("express");
const userControllers = require("../controllers/userControllers");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const asyncHandler = require("express-async-handler");
const validateUser = require("../middleware/validateUser");
const validateParams = require("../middleware/validateParams");
const validateUserUpdate = require("../middleware/validateUserUpdate");

// GET ALL
router.get("/", verifyJWT(["ADMIN"]), asyncHandler(userControllers.getUsers));

// GET ONE
router.get(
  "/:id",
  verifyJWT(["ADMIN", "CLIENT"]),
  validateParams,
  asyncHandler(userControllers.getUserById)
);

// POST
router.post(
  "/",
  verifyJWT(["ADMIN"]),
  validateUser,
  asyncHandler(userControllers.createUser)
);

// DELETE
router.delete(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(userControllers.deleteUser)
);

// PATCH
router.patch(
  "/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  validateUserUpdate,
  asyncHandler(userControllers.updateUser)
);

router.get(
  "/info/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(userControllers.getUserInfo)
);
router.get(
  "/toggle/:id",
  verifyJWT(["ADMIN"]),
  validateParams,
  asyncHandler(userControllers.toggleUser)
);
module.exports = router;

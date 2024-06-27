const { body, validationResult } = require("express-validator");
const { regions } = require("../data/regions");
const User = require("../models/User");

const checkDuplicateEmail = async (email) => {
  const user = await User.findOne({ where: { Email: email } });
  if (user) {
    throw new Error("Email already in use");
  }
};

const validateUserUpdate = [
  // Validate and sanitize request body fields
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name must contain only letters and spaces")
    .escape(),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Last name must contain only letters and spaces")
    .escape(),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .escape(),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email is not valid")
    .normalizeEmail()
    .escape()
    .custom(checkDuplicateEmail),

  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .escape(),

  body("contact")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Contact is required")
    .isMobilePhone()
    .withMessage("Contact must be a valid phone number")
    .escape(),

  body("province")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Province is required")
    .escape(),

  body("municipality")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Municipality is required")
    .custom((value, { req }) => {
      const province = req.body.province;
      if (!regions[province] || !regions[province].includes(value)) {
        throw new Error(`${value} does not belong to the ${province}`);
      }
      return true;
    })
    .escape(),

  body("role")
    .optional()
    .trim()
    .isIn(["ADMIN", "CLIENT", "TECHNICIAN"])
    .withMessage("Role must be one of the following: admin, client, technician")
    .escape(),

  // Custom middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUserUpdate;

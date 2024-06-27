const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// login
// route /auth/
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  const foundUser = await User.findOne({
    where: { Email: email },
  });

  if (!foundUser) {
    return res.status(404).json({ message: "No se encontro el usuario" });
  }
  if (!foundUser.Active) {
    return res.status(401).json({ message: "El usuario no esta activo" });
  }

  const match = await bcrypt.compare(password, foundUser.Password);
  // const match = true;
  if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

  const accessToken = jwt.sign(
    {
      Info: {
        id: foundUser.UserID,
        email: foundUser.Email,
        role: foundUser.Role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { Email: foundUser.Email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "3d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing ClientEmail and roles
  res.json({ accessToken, role: foundUser.Role });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findOne({
        where: { Email: decoded.Email },
      });

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          Info: {
            id: foundUser.UserID,
            email: foundUser.Email,
            role: foundUser.Role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ accessToken, role: foundUser.Role });
    })
  );
};

// // @desc Logout
// // @route POST /auth/logout
// // @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};

const Client = require("../models/Client");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// login
// route /auth/
const login = asyncHandler(async (req, res) => {
  const { ClientEmail, ClientPassword } = req.body;

  console.log(req.body);
  if (!ClientEmail || !ClientPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundClient = await Client.findOne({
    where: { ClientEmail },
  });

  if (!foundClient || !foundClient.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(
    ClientPassword,
    foundClient.ClientPassword
  );
  // const match = true;
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      ClientInfo: {
        ClientEmail: foundClient.ClientEmail,
        role: foundClient.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { ClientEmail: foundClient.ClientEmail },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing ClientEmail and roles
  res.json({ accessToken, role: foundClient.role });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundClient = await Client.findOne({
        where: { ClientEmail: decoded.ClientEmail },
      });

      if (!foundClient)
        return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          ClientInfo: {
            ClientEmail: foundClient.ClientEmail,
            roles: foundClient.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken, role: foundClient.role });
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

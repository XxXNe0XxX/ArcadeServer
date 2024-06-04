const jwt = require("jsonwebtoken");

const verifyJWT = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader);
    console.log(allowedRoles);
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      // Check if the user's role is among the allowed roles
      // const hasRole = allowedRoles.some(
      //   (role) => decoded.ClientInfo.role === role
      // );
      const hasRole = allowedRoles.includes(decoded.ClientInfo.role);
      console.log(hasRole);
      console.log(decoded.ClientInfo);
      console.log(decoded.ClientInfo.ClientEmail);
      if (!hasRole) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      // Attach the user and role information to the request object
      req.user = decoded.ClientInfo.ClientEmail;
      req.role = decoded.ClientInfo.role;
      next();
    });
  };
};

module.exports = verifyJWT;

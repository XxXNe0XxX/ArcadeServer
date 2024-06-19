const validateIdentifier = (req, res, next) => {
  const params = req.params;
  const body = req.body;

  if (body.identifier) {
    try {
      // Remove all whitespace characters and convert to lowercase
      let cleanedString = body.identifier.replace(/\s+/g, "").toLowerCase();
      // Check the length of the string
      if (cleanedString.length !== 32 && cleanedString.length !== 36) {
        return res.status(400).json({ message: "Identificador invalido" });
      }
      // Remove hyphens if the string already has them
      if (cleanedString.length === 36) {
        cleanedString = cleanedString.replace(/-/g, "");
      }
      // Ensure the string is now 32 characters long
      if (cleanedString.length !== 32) {
        return res.status(400).json({ message: "Identificador invalido" });
      } else return next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Solicitud incorrecta falta el campo identifier" });
  }
};

module.exports = validateIdentifier;

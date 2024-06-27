const { regions } = require("../data/regions");

const validateLocation = (req, res, next) => {
  const { municipality, province } = req.body.formData;

  if (province && !municipality) {
    return res.status(400).json({ message: "Municipio incorrecto" });
  }
  //   if(!province && municipality){
  //     function findRegionForKey(value) {
  //         // Iterate through each region and its cities
  //         for (const region in exports.regions) {
  //           if (exports.regions.hasOwnProperty(region)) {
  //             const cities = exports.regions[region];
  //             // Check if the value exists in the current region's cities array
  //             if (cities.includes(value)) {
  //               // Return the region name if a match is found
  //               return region;
  //             }
  //           }
  //         }
  //         // Return null if no match is found
  //         return null;
  //       }
  //       findRegionForKey(municipality)
  //     }
  if (!province && municipality) {
    next();
  }
  if (municipality && province) {
    if (regions[province].includes(municipality)) {
      next();
    } else {
      return res.status(400).json({
        message:
          "Solicitud incorrecta: el municipio y la provincia no coinciden",
      });
    }
  }
};

module.exports = validateLocation;

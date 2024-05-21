const express = require("express");
const clientControllers = require("../controllers/clientControllers");
const router = express.Router();

router.get("/", clientControllers.getClients);
router.get("/getClient/:clientId", clientControllers.getClient);
router.post("/createClient", clientControllers.createClient);
router.put("/updateClient/:clientId", clientControllers.updateClient);
router.delete("/deleteClient/:clientId", clientControllers.deleteClient);

module.exports = router;

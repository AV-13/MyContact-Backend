const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const router = express.Router();
const { securityRoute } = require("../controllers/utilController");


router.get("/", (req, res) => {
    res.status(200).json({ message: "Bienvenue sur l'API de MyContact" });
})


router.get("/security", requireAuth, securityRoute);

module.exports = router;
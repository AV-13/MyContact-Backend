const express = require("express");
const authController = require("./../controllers/authController");
const { validateUser, validateConnection } = require("./../middleware/validationMiddleware");
const router = express.Router();

router.post("/register", validateUser, authController.register);
router.post("/login", validateConnection, authController.login);
router.get("/logout", authController.logout);
router.get("/test" , (req, res) => {
    console.log("Route /test appelée");
    res.status(200).json({ message: "API Auth is working!" });
});

module.exports = router;
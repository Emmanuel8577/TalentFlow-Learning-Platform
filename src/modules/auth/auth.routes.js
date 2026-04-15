const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout); // This is Line 8 - now it will find the function!
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword); 

module.exports = router;
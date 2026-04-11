const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

// Line 12 is likely around here
router.post("/register", authController.register);

// Check if these names EXACTLY match what is in auth.controller.js
router.post("/verify-otp", authController.verifyOTP); 
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
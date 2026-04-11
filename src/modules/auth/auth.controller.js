const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");
const redisClient = require("../../config/redis");
const sendEmail = require("../../utils/mailer");
const { success, error } = require("../../utils/response");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ── REGISTER ────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    // 1. SECURITY: Block public Admin registration
    if (role && role.toLowerCase() === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin registration is restricted. Use the internal script.",
      });
    }

    // 2. Determine final role (default to learner)
    const allowedRoles = ["instructor", "learner"];
    const finalRole = role && allowedRoles.includes(role.toLowerCase()) 
      ? role.toLowerCase() 
      : "learner";

    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return error(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Updated SQL to include 'role'
    const result = await db.query(
      "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, is_verified",
      [email, hashedPassword, name, finalRole]
    );
    
    const user = result.rows[0];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.setEx(`otp:${email}`, 600, otp);

    const emailContent = `<h1>Welcome to TalentFlow</h1><p>Your verification code is: <b>${otp}</b>. It expires in 10 minutes.</p>`;
    await sendEmail(
      email,
      "Verify Your Account - TalentFlow",
      `Your OTP is ${otp}`,
      emailContent
    );

    return success(
      res,
      "Registration successful. OTP sent to email.",
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
      },
      201
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── VERIFY OTP ──────────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      return error(res, "Invalid or expired OTP code", 400);
    }

    const result = await db.query(
      "UPDATE users SET is_verified = true WHERE email = $1 RETURNING id, name, email, role, is_verified",
      [email]
    );

    if (result.rowCount === 0) return error(res, "User not found", 404);

    await redisClient.del(`otp:${email}`);
    return success(res, "Account verified successfully!", { user: result.rows[0] });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── LOGIN ───────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return error(res, "Invalid email or password", 401);
    }

    if (!user.is_verified) {
      return error(res, "Please verify your email before logging in", 403);
    }

    const token = generateToken(user);
    return success(res, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── LOGOUT ──────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return success(res, "Logged out successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── FORGOT PASSWORD ─────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return error(res, "User not found", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.setEx(`otp_reset:${email}`, 900, otp);

    await sendEmail(
      email,
      "Password Reset - TalentFlow",
      `Your reset code is ${otp}`,
      `<p>Use this code to reset your password: <b>${otp}</b></p>`
    );

    return success(res, "Password reset OTP sent to email");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── RESET PASSWORD ──────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const storedOtp = await redisClient.get(`otp_reset:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      return error(res, "Invalid or expired OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    if (result.rowCount === 0) return error(res, "User not found", 404);

    await redisClient.del(`otp_reset:${email}`);
    return success(res, "Password reset successful.");
  } catch (err) {
    return error(res, err.message, 500);
  }
};
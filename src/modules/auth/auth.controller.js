const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");
const { success, error } = require("../../utils/response");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ── REGISTER (Simplified) ──────────────────────────────────────────
exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    if (role && role.toLowerCase() === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin registration is restricted.",
      });
    }

    const allowedRoles = ["instructor", "learner"];
    const finalRole = role && allowedRoles.includes(role.toLowerCase()) ? role.toLowerCase() : "learner";

    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return error(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Set is_verified = true by default so they can login immediately
    const result = await db.query(
      "INSERT INTO users (email, password, name, role, is_verified) VALUES ($1, $2, $3, $4, true) RETURNING id, name, email, role",
      [email, hashedPassword, name, finalRole]
    );

    return success(res, "Account created successfully!", { user: result.rows[0] }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── LOGIN (Simplified) ─────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return error(res, "Invalid email or password", 401);
    }

    // No is_verified check needed as we set it true on registration
    const token = generateToken(user);
    return success(res, "Login successful", {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── LOGOUT ──────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    // If you're using cookies, clear them here. Otherwise, just return success.
    return success(res, "Logged out successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── FORGOT PASSWORD (Simple Email Check) ───────────────────────────
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (result.rows.length === 0) {
      return error(res, "Email not found", 404);
    }

    // Since we are skipping OTP, we just confirm the email exists
    // The frontend can now navigate them to the reset page
    return success(res, "Email verified. Proceed to reset password.");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── RESET PASSWORD (Direct) ────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    if (result.rowCount === 0) return error(res, "User not found", 404);

    return success(res, "Password reset successfully. You can now log in.");
  } catch (err) {
    return error(res, err.message, 500);
  }
};
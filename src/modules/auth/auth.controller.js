const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const pool = require('../config/db');
const redisClient = require("../config/redis");
const bcrypt = require("bcryptjs");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // 1. Check if user exists
    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    // 2. Hash password & Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // 3. Redis Caching: Store a 6-digit OTP for 10 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.setEx(`otp:${email}`, 600, otp);
    console.log(`OTP for ${email} stored in Redis.`);

    // 4. Standardized Response (Rule #1)
    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to email.",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Query the PostgreSQL database for the user
        // Note: 'rows' will be empty if the user doesn't exist
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // 2. Validate user and password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                data: null
            });
        }

        // 3. Create the JWT Token
        // We include the role so Toria/Temyl can check for 'admin' or 'instructor'
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // 4. Standardized Response (Team Rule #1)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Since we are using Bearer tokens, the client just needs to discard it.
        // We return a success message as per Team Rule #1.
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
            data: null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // 1. Check if user exists in PG
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Generate a random reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 3. Store in Redis for 15 minutes
        await redisClient.setEx(`reset:${resetToken}`, 900, email);

        // 4. Send Email (using your working SMTP setup)
        // sendPasswordResetEmail(email, resetToken); 

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to email",
            data: { resetToken } // In production, don't return this; only send via email
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // 1. Fetch the OTP from Redis
        const storedOtp = await redisClient.get(`otp_reset:${email}`);

        // 2. Verify if OTP exists and matches
        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
                data: null
            });
        }

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update the password in PostgreSQL (Neon)
        const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
        const result = await pool.query(updateQuery, [hashedPassword, email]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // 5. DELETE the OTP from Redis so it can't be used again
        await redisClient.del(`otp_reset:${email}`);

        return res.status(200).json({
            success: true,
            message: "Password reset successful. You can now login.",
            data: null
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};
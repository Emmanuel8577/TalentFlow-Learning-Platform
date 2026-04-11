require("dotenv").config();
const db = require("../src/config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function createAdmin() {
  try {
    // Admin details — change these!
    const name = "TalentFlow Admin";
    const email = "admin@talentflow.com";
    const password = "Admin@2026";
    const role = "admin";

    // Check if admin already exists
    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const result = await db.query(
      `INSERT INTO users (id, name, email, password, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role`,
      [uuidv4(), name, email, hashedPassword, role, true]
    );

    console.log("Admin created successfully!");
    console.log("Details:", result.rows[0]);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Please change the password after first login!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
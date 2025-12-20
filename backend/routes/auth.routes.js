// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ✅ bcryptjs
const jwt = require("jsonwebtoken");
const db = require("../db.config");

// ==============================
// REGISTER
// ==============================
router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    blood_type,
    phone_number,
    city,
  } = req.body;

  if (!email || !password || !blood_type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO donors 
       (first_name, last_name, email, password_hash, blood_type, phone_number, city)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        blood_type,
        phone_number,
        city,
      ]
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [[donor]] = await db.execute(
      "SELECT * FROM donors WHERE email = ?",
      [email]
    );

    if (!donor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, donor.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: donor.donor_id,   // ✅ IMPORTANT
        email: donor.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;

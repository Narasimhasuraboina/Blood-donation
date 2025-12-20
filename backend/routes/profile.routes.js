// backend/routes/profile.routes.js
const express = require("express");
const router = express.Router();
const db = require("../db.config");
const verifyToken = require("../middleware/verifyToken");

// ======================================
// GET CURRENT LOGGED-IN USER
// ======================================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const donorId = req.donor.id;

    const [[donor]] = await db.execute(
      `SELECT 
        first_name,
        last_name,
        blood_type,
        city,
        phone_number
       FROM donors
       WHERE donor_id = ?`,
      [donorId]
    );

    if (!donor) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: donor.first_name + " " + donor.last_name,
      blood_type: donor.blood_type,
      city: donor.city,
      phone: donor.phone_number,
      total_donations: 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================
// GET ALL DONORS (PUBLIC)
// ======================================
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        CONCAT(first_name, ' ', last_name) AS name,
        blood_type,
        city,
        phone_number AS phone
       FROM donors`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donors" });
  }
});

module.exports = router;

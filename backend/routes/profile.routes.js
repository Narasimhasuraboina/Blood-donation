// backend/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db.config');
const verifyToken = require('../middleware/verifyToken'); // Required for all protected routes

// ===============================================
// 1. ENDPOINT TO FETCH THE LOGGED-IN DONOR'S PROFILE
//    GET /api/profile/profile (Protected)
// ===============================================
router.get('/profile', verifyToken, async (req, res) => {
    // req.donor.id is available because verifyToken attached the decoded JWT payload
    const donorId = req.donor.id;

    try {
        const [rows] = await db.execute(
            'SELECT first_name, last_name, email, blood_type, date_of_birth, phone_number, city FROM donors WHERE donor_id = ?',
            [donorId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Donor not found.' });
        }

        res.status(200).json(rows[0]);

    } catch (error) {
        console.error('Fetch profile error:', error);
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
});


// ===============================================
// 2. ENDPOINT TO UPDATE THE LOGGED-IN DONOR'S PROFILE
//    PUT /api/profile/update (Protected)
// ===============================================
router.put('/update', verifyToken, async (req, res) => {
    const donorId = req.donor.id; // User ID from the JWT token
    const { first_name, last_name, date_of_birth, phone_number, city } = req.body;

    // Dynamic SQL update query builder
    const fields = [];
    const values = [];

    if (first_name) {
        fields.push('first_name = ?');
        values.push(first_name);
    }
    if (last_name) {
        fields.push('last_name = ?');
        values.push(last_name);
    }
    if (date_of_birth) {
        fields.push('date_of_birth = ?');
        values.push(date_of_birth);
    }
    if (phone_number) {
        fields.push('phone_number = ?');
        values.push(phone_number);
    }
    if (city) {
        fields.push('city = ?');
        values.push(city);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    try {
        const sql = `
            UPDATE donors 
            SET ${fields.join(', ')}
            WHERE donor_id = ?
        `;
        values.push(donorId); // Add the donorId to the end of the values array

        await db.execute(sql, values);

        res.status(200).json({ 
            message: 'Profile updated successfully!'
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error during profile update.' });
    }
});


// ===============================================
// 3. ENDPOINT TO FETCH A LIST OF ALL REGISTERED DONORS (ADMIN VIEW)
//    GET /api/profile/all-donors (Protected)
// ===============================================
router.get('/all-donors', verifyToken, async (req, res) => {
    // NOTE: This route is protected, but in a production app, you would add logic
    // to verify the user has an 'admin' role before allowing access to all data.
    
    try {
        // Select all non-sensitive donor information, ordered by ID
        const [rows] = await db.execute(
            'SELECT donor_id, first_name, last_name, email, blood_type, date_of_birth, phone_number, city FROM donors ORDER BY donor_id DESC'
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error('Fetch all donors error:', error);
        res.status(500).json({ message: 'Server error fetching donor list.' });
    }
});


module.exports = router;
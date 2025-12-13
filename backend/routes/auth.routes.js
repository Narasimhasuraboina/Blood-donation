// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // FOR LOGIN: Required to create the JWT token
const db = require('../db.config'); // Your MySQL connection

// ===============================================
// 1. DONOR REGISTRATION ENDPOINT
// ===============================================
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, blood_type, date_of_birth, phone_number, city } = req.body;

    if (!email || !password || !blood_type) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // 1. Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 2. Insert into the MySQL database using prepared statements
        const sql = `
            INSERT INTO donors 
            (first_name, last_name, email, password_hash, blood_type, date_of_birth, phone_number, city) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [first_name, last_name, email, password_hash, blood_type, date_of_birth, phone_number, city];

        const [result] = await db.execute(sql, values);

        res.status(201).json({ 
            message: 'Donor registered successfully!', 
            donorId: result.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email address is already registered.' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});


// ===============================================
// 2. DONOR LOGIN ENDPOINT
// ===============================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 1. Find the donor by email
        const [rows] = await db.execute(
            'SELECT donor_id, password_hash FROM donors WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            // User not found
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const donor = rows[0];
        
        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, donor.password_hash);

        if (!isMatch) {
            // Password does not match
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        
        // CRITICAL CHECK: Ensure JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is not set in .env file!");
            // This error prevents the next line from crashing the app with a token error
            return res.status(500).json({ message: 'Server configuration error.' }); 
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: donor.donor_id, email: email },
            process.env.JWT_SECRET, // Your secret key from the .env file
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // 4. Send token back to client
        res.status(200).json({
            message: 'Login successful',
            token: token,
            donorId: donor.donor_id
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;
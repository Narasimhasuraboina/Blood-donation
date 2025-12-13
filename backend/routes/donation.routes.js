// backend/routes/donation.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db.config');
const verifyToken = require('../middleware/verifyToken');

// Endpoint to log a new donation for the logged-in donor
// POST /api/donation/log
router.post('/log', verifyToken, async (req, res) => {
    // donorId comes from the decoded JWT token
    const donorId = req.donor.id; 
    const { donation_date, quantity_ml, location } = req.body;

    if (!donation_date || !quantity_ml) {
        return res.status(400).json({ message: 'Donation date and quantity are required.' });
    }

    try {
        const sql = `
            INSERT INTO donations 
            (donor_id, donation_date, quantity_ml, location) 
            VALUES (?, ?, ?, ?)
        `;
        const values = [donorId, donation_date, quantity_ml, location];

        await db.execute(sql, values);

        res.status(201).json({ 
            message: 'Donation successfully logged!',
            donorId: donorId
        });

    } catch (error) {
        console.error('Donation logging error:', error);
        res.status(500).json({ message: 'Server error when logging donation.' });
    }
});

// Endpoint to fetch the history of donations for the logged-in donor (required later)
// GET /api/donation/history
router.get('/history', verifyToken, async (req, res) => {
    const donorId = req.donor.id; 
    
    try {
        const [rows] = await db.execute(
            'SELECT donation_id, donation_date, quantity_ml, location, created_at FROM donations WHERE donor_id = ? ORDER BY donation_date DESC',
            [donorId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Fetch donation history error:', error);
        res.status(500).json({ message: 'Server error fetching history.' });
    }
});


module.exports = router;
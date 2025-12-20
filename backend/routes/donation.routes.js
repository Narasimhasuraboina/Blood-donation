// backend/routes/donation.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db.config');
const verifyToken = require('../middleware/verifyToken');

// ===============================================
// LOG A NEW DONATION
// POST /api/donation/log
// ===============================================
router.post('/log', verifyToken, async (req, res) => {
    const donorId = req.donor.id;
    const { donation_date, quantity_ml, donation_center } = req.body;

    if (!donation_date || !quantity_ml) {
        return res.status(400).json({
            message: 'Donation date and quantity are required'
        });
    }

    try {
        const sql = `
            INSERT INTO donations
            (donor_id, donation_date, quantity_ml, donation_center)
            VALUES (?, ?, ?, ?)
        `;

        await db.execute(sql, [
            donorId,
            donation_date,
            quantity_ml,
            donation_center || null
        ]);

        res.status(201).json({
            message: 'Donation logged successfully'
        });

    } catch (error) {
        console.error('Log donation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// ===============================================
// GET DONATION HISTORY
// GET /api/donation/history
// ===============================================
router.get('/history', verifyToken, async (req, res) => {
    const donorId = req.donor.id;

    try {
        const [rows] = await db.execute(`
            SELECT
                donation_id,
                donation_date,
                quantity_ml,
                donation_center
            FROM donations
            WHERE donor_id = ?
            ORDER BY donation_date DESC
        `, [donorId]);

        res.json(rows);

    } catch (error) {
        console.error('Fetch donation history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

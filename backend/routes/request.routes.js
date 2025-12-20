// backend/routes/request.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db.config');
const verifyToken = require('../middleware/verifyToken');

// ===============================================
// 1. CREATE BLOOD REQUEST (PUBLIC)
// POST /api/request/create
// ===============================================
router.post('/create', async (req, res) => {
    const {
        requested_blood_type,
        units_required,
        urgency_level,
        hospital_name,
        contact_person
    } = req.body;

    if (!requested_blood_type || !units_required || !urgency_level) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try {
        const sql = `
            INSERT INTO requests
            (requested_blood_type, units_required, urgency_level, hospital_name, contact_person, status)
            VALUES (?, ?, ?, ?, ?, 'ACTIVE')
        `;

        await db.execute(sql, [
            requested_blood_type,
            units_required,
            urgency_level,
            hospital_name,
            contact_person
        ]);

        res.status(201).json({
            message: 'Blood request created successfully'
        });

    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// ===============================================
// 2. GET ALL ACTIVE REQUESTS (PUBLIC - NO CONTACT)
// GET /api/request/active
// ===============================================
router.get('/active', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                request_id,
                requested_blood_type,
                units_required,
                urgency_level,
                hospital_name,
                request_date
            FROM requests
            WHERE status = 'ACTIVE'
            ORDER BY request_date DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error('Active request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// ===============================================
// 3. GET FILTERED REQUESTS (LOGGED-IN DONOR)
// GET /api/request/filtered
// ===============================================
router.get('/filtered', verifyToken, async (req, res) => {
    try {
        const donorId = req.donor.id;

        // 1️⃣ Get donor blood group from DB
        const [[donor]] = await db.execute(
            'SELECT blood_type FROM donors WHERE donor_id = ?',
            [donorId]
        );

        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // 2️⃣ Get matching requests
        const [requests] = await db.execute(`
            SELECT
                request_id,
                requested_blood_type,
                units_required,
                urgency_level,
                hospital_name,
                request_date
            FROM requests
            WHERE requested_blood_type = ?
              AND status = 'ACTIVE'
            ORDER BY request_date DESC
        `, [donor.blood_type]);

        res.json(requests);

    } catch (error) {
        console.error('Filtered request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// ===============================================
// 4. GET CONTACT DETAILS (PROTECTED + MATCH CHECK)
// GET /api/request/:id/contact
// ===============================================
router.get('/:id/contact', verifyToken, async (req, res) => {
    try {
        const donorId = req.donor.id;
        const requestId = req.params.id;

        // 1️⃣ Get donor blood type
        const [[donor]] = await db.execute(
            'SELECT blood_type FROM donors WHERE donor_id = ?',
            [donorId]
        );

        // 2️⃣ Get request details
        const [[request]] = await db.execute(`
            SELECT
                requested_blood_type,
                hospital_name,
                contact_person
            FROM requests
            WHERE request_id = ?
              AND status = 'ACTIVE'
        `, [requestId]);

        if (!donor || !request) {
            return res.status(404).json({ message: 'Not found' });
        }

        // 3️⃣ Blood group check
        if (donor.blood_type !== request.requested_blood_type) {
            return res.status(403).json({
                message: 'Blood type does not match'
            });
        }

        res.json({
            hospital_name: request.hospital_name,
            contact_person: request.contact_person
        });

    } catch (error) {
        console.error('Contact fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

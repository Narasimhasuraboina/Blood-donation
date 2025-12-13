// backend/routes/request.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db.config');
const verifyToken = require('../middleware/verifyToken'); // Required for the /filtered route

// ===============================================
// 1. ENDPOINT TO CREATE A NEW BLOOD REQUEST (Public POST)
//    POST /api/request/create
// ===============================================
router.post('/create', async (req, res) => {
    const { requested_blood_type, units_required, urgency_level, hospital_name, contact_person } = req.body;

    if (!requested_blood_type || !units_required || !urgency_level) {
        return res.status(400).json({ message: 'Missing required fields (blood type, units, urgency).' });
    }

    try {
        const sql = `
            INSERT INTO requests 
            (requested_blood_type, units_required, urgency_level, hospital_name, contact_person) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [requested_blood_type, units_required, urgency_level, hospital_name, contact_person];

        await db.execute(sql, values);

        res.status(201).json({ 
            message: 'Blood request successfully logged.', 
            type: requested_blood_type
        });

    } catch (error) {
        console.error('Request creation error:', error);
        res.status(500).json({ message: 'Server error when logging request.' });
    }
});


// ===============================================
// 2. ENDPOINT TO FETCH ALL ACTIVE REQUESTS (Public GET)
//    GET /api/request/active
// ===============================================
router.get('/active', async (req, res) => {
    try {
        // Fetch all requests for the public view
        const [rows] = await db.execute(
            'SELECT request_id, requested_blood_type, units_required, urgency_level, hospital_name, contact_person, request_date FROM requests ORDER BY request_date DESC'
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error('Fetch requests error:', error);
        res.status(500).json({ message: 'Server error fetching blood requests.' });
    }
});


// ===============================================
// 3. ENDPOINT TO FETCH FILTERED BLOOD REQUESTS FOR LOGGED-IN DONOR (Protected GET)
//    GET /api/request/filtered
// ===============================================
router.get('/filtered', verifyToken, async (req, res) => {
    const donorId = req.donor.id; 
    
    try {
        // 1. Fetch the logged-in donor's blood type
        const [donorRows] = await db.execute(
            'SELECT blood_type FROM donors WHERE donor_id = ?',
            [donorId]
        );

        if (donorRows.length === 0) {
            return res.status(404).json({ message: 'Donor profile not found.' });
        }
        
        const donorBloodType = donorRows[0].blood_type;

        // 2. Fetch requests matching the donor's exact blood type
        const [requestRows] = await db.execute(
            'SELECT request_id, requested_blood_type, units_required, urgency_level, hospital_name, contact_person, request_date FROM requests WHERE requested_blood_type = ? ORDER BY request_date DESC',
            [donorBloodType]
        );

        res.status(200).json(requestRows);

    } catch (error) {
        console.error('Fetch filtered requests error:', error);
        res.status(500).json({ message: 'Server error fetching filtered requests.' });
    }
});

module.exports = router;
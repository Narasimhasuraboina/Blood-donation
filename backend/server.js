// server.js
const express = require('express');
const cors = require('cors'); 
require('dotenv').config(); // Load environment variables from .env

// --- ROUTE IMPORTS ---
const authRoutes = require('./routes/auth.routes'); 
const requestRoutes = require('./routes/request.routes'); 
const profileRoutes = require('./routes/profile.routes'); 
const donationRoutes = require('./routes/donation.routes'); // NEW: For Donor Donations

const app = express();
const port = process.env.PORT || 5000; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- ROUTE LINKAGES ---
// 1. Authentication (Registration/Login)
app.use('/api/auth', authRoutes); 

// 2. Blood Requests (Create/View List)
app.use('/api/request', requestRoutes); 

// 3. Donor Profile (View/Update Profile, View All Donors)
app.use('/api/profile', profileRoutes); 

// 4. Donations (Log Donation/View History)
app.use('/api/donation', donationRoutes); 

app.get('/', (req, res) => {
    res.send('Blood Donation Backend API is Running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
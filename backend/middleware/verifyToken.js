// backend/middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Check for token in the Authorization header (standard practice)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // 2. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach the decoded user info (donor ID, email) to the request object
        req.donor = decoded; 
        
        // 4. Proceed to the next middleware or the route handler
        next();
    } catch (error) {
        // Token is invalid (expired, wrong signature, etc.)
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken;
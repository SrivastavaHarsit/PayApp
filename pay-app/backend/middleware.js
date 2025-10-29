const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check for Authorization header
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Authorization header missing or not valid"
        })
    }

    // Extracting token
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded || !decoded.userId) {
            return res.status(401).json({
                message: "Invalid/Expired token"
            })
        }
        req.userId = decoded.userId;
        next();
    } catch(e) {
        return res.status(403).json({
            message: "Invalid/Expired token"
        })
    }
}

module.exports = { authMiddleware };

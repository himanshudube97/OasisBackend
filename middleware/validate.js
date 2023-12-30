
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Check if the token is present
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify and decode the token
    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }

        // If token is valid, add decoded user information to the request object
        req.user = decoded;
        next(); // Move to the next middleware or route handler
    });
}


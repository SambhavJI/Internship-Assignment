import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        console.log("The decoded user is : ", req.user);
        next();
    } catch (err) {
        res.status(400).json({ message: "Token is not valid" });
    }
};

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

export { verifyToken, authorizeRole };

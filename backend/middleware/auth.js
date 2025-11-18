// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const { UserModel } = require('../model/userModel');

const auth = async(req, res, next) => {
    try{
        console.log('\n🔐 Auth Middleware Called');
        console.log('Route:', req.path);
        
        const authHeader = req.header('Authorization');
        console.log('Auth Header:', authHeader ? 'Present' : 'Missing');
        
        const token = authHeader?.replace('Bearer ', '');

        if(!token){
            console.log('❌ No token provided');
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        console.log('Token (first 30 chars):', token.substring(0, 30) + '...');
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded. User ID:', decoded.userId);
        
        const user = await UserModel.findById(decoded.userId).select('-password');

        if (!user) {
            console.log('❌ User not found for ID:', decoded.userId);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token. User not found.' 
            });
        }

        console.log('✅ User found:', user.username);
        req.user = user;

        next();
    }catch(error){
        console.error('❌ Auth middleware error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token format' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }
        
        res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
}

module.exports = auth;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { UserModel } = require('../model/userModel');
const auth = require('../middleware/auth');


const generateToken = (userId) => {
    return jwt.sign(
        { userId },                    
        process.env.JWT_SECRET,      
        { expiresIn: '7d' }         
    );
}

router.post('/register', async(req, res) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide username, email and password' 
            });
        }

        if(password.length < 6){
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        })

        if(existingUser){
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email or username already exists' 
            });
        }

        const user = new UserModel({ 
            username, 
            email, 
            password  
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,                      // Token frontend ko bhejo
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

router.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user      
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});


router.post('/logout', auth, (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
// import User from '../models/userSchema.js';
const User = require('../models/userSchema.js');

const signUpController = async (req, res) => {
    const { userName, userPassword } = req.body;

    try {
        const existingUser = await User.findOne({ username: userName });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Signup failed. User already exists.' });
        }

        const newUser = new User({
            username: userName,
            password: userPassword,
        });
        await newUser.save();

        return res.json({ success: true, message: 'Signup successful', redirect: '/Home' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = signUpController;

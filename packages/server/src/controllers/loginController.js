// import User from '../models/userSchema.js';
const User = require('../models/userSchema.js');

const loginController =async(req,res)=>{
  const { userName, userPassword } = req.body;
    try {
      const user = await User.findOne({
        username: userName,
        password: userPassword
      });
      if (user) {
        // console.log('found user');
        res.json({ success: true, message: 'Login successful' });
      } else {
        // console.log('User not found');
        res.json({ success: false, message: 'Login failed. User not found.' });
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports=loginController;
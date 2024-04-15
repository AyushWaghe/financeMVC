const express =require('express');
const loginController = require('../controllers/loginController.js');
const signUpController = require('../controllers/signUpController.js');

//router object
const router= express.Router();

//LOGIN || POST
router.post('/userLogin',loginController);
router.post('/userSignUp',signUpController);

module.exports=router;
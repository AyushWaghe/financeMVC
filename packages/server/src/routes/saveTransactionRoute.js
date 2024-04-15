const express =require('express');
const saveTransactionController=require('../controllers/saveTransactionController.js');
const updateTransactionController=require('../controllers/updateTransactionController.js');
//router object
const router= express.Router();

//LOGIN || POST
router.post('/saveTransaction',saveTransactionController);
router.post('/updateTransaction',updateTransactionController);

module.exports=router;
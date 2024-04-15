const express =require('express');
const deleteTransactionController=require('../controllers/deleteTransactionController.js');

//router object
const router= express.Router();

//LOGIN || POST
router.delete('/delete',deleteTransactionController);

module.exports=router;
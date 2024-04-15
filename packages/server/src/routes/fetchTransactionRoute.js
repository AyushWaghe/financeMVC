const express =require('express');
const {fetchTransactionController,fetchTransactionsForGraphsController}=require('../controllers/fetchTransactionController.js');
//router object
const router= express.Router();

//LOGIN || POST
router.get('/fetch',fetchTransactionController);
router.get('/fetchG',fetchTransactionsForGraphsController);

module.exports=router;
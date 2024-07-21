const express =require('express');
const transactionOperationsController=require('../controllers/transactionOperationsController.js');
//router object
const router= express.Router();

//LOGIN || POST
router.post('/saveTransaction',transactionOperationsController.saveTransaction);
router.post('/updateTransaction',transactionOperationsController.updateTransaction);
router.get('/fetch',transactionOperationsController.fetchTransaction);
router.delete('/delete',transactionOperationsController.deleteTransaction);

//Graphs
router.get('/fetchG',transactionOperationsController.fetchTransactionsForGraphs);



module.exports=router;
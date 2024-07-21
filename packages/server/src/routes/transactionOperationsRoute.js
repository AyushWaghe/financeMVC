const express =require('express');
const transactionOperationsController=require('../controllers/transactionOperationsController.js');

const router= express.Router();

//Transaction operations CRUD
router.post('/saveTransaction',transactionOperationsController.saveTransaction);
router.post('/updateTransaction',transactionOperationsController.updateTransaction);
router.get('/fetch',transactionOperationsController.fetchTransaction);
router.delete('/delete',transactionOperationsController.deleteTransaction);

//Graphs
router.get('/fetchG',transactionOperationsController.fetchTransactionsForGraphs);



module.exports=router;

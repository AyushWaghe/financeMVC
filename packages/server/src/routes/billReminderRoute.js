const express =require('express');


//Update
const billCRUDoperations=require('../controllers/billCRUDoperations.js');
//router object
const router= express.Router();

//LOGIN || POST
router.post('/saveBill',billCRUDoperations.saveBillReminder);
router.get('/fetchBills',billCRUDoperations.fetchBills);
router.delete('/deleteBill',billCRUDoperations.deleteBillReminder);
router.get('/fetchBillAlert',billCRUDoperations.fetchBillAlert);

module.exports=router;

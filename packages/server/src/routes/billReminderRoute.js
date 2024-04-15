const express =require('express');
const saveBillReminderController=require('../controllers/saveBillReminderController.js');
const fetchBillsController=require('../controllers/fetchBillsController.js');
const deleteBillReminderController=require('../controllers/deleteBillReminderController.js'); 
const fetchBillAlertController=require('../controllers/fetchBillAlertController.js');
//router object
const router= express.Router();

//LOGIN || POST
router.post('/saveBill',saveBillReminderController);
router.get('/fetchBills',fetchBillsController);
router.delete('/deleteBill',deleteBillReminderController);
router.get('/fetchBillAlert',fetchBillAlertController);
// router.get('/fetchInActiveBills',deleteBillReminderController);

module.exports=router;

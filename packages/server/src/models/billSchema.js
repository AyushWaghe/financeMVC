
const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({
  userBills: String,
  bills:[{
    billId:Number,
    billDescription:String,
    billAmount:Number,
    billDueDate:String,
  }]
})

const Bills = mongoose.model('Bills', billSchema);
module.exports = Bills;
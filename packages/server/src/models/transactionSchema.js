
const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  userTransactions: String,
  transactions: [{
    month: String,
    total:{ type: Number, default: 0 },
    transactionDetails: [{
      id: Number,
      description: String,
      cost: Number,
      date: String,
    }]
  }]
})

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
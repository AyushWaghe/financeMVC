const mongoose = require('mongoose');
// import {TransactionSchema} from './transactionSchema.js';
const Transaction =require('./transactionSchema.js');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });

const User= mongoose.model('User',userSchema);

module.exports=User;
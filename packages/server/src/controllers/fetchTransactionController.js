const User = require('../models/userSchema.js');
const Transaction = require('../models/transactionSchema.js');

const fetchTransactionController =async(req,res)=>{
    try {
        console.log('Fetching transaction');
        const { userName, month } = req.query;
        console.log(userName);
        console.log(month);
        const currentUser = await Transaction.findOne({ userTransactions: userName });
        // console.log(currentUser);
    
        if (!currentUser) {
          // console.log("User NOT FOUND...");  // Log when userName is missing
          return res.status(404).json({ message: 'User not found' });
        }
        if (currentUser) {
          // console.log("User found, sending transactions...");
          // return res.status(200).json({ transactions: currentUser.transactionHistory });
          const transactions = await currentUser.transactions.find(en => en.month == month);
    
          if (!transactions) {
            return res.status(200).json({ success: false, message: "No transaction for that month" });
          } else {
            return res.status(200).json({ success: true, transactions: transactions.transactionDetails,monthTotal:transactions.total });
          }
        } else {
          // console.log("User NOT FOUND...");
          return res.status(404).json({ message: 'User not found' });
        }
    
      } catch (error) {
        // console.log(error.message);
        return res.status(500).json({ message: "Server error" });
      }  
    }

    const fetchTransactionsForGraphsController = async (req, res) => {
      try{
        const {userName}=req.query;
        const currentUser=await Transaction.findOne({ userTransactions: userName });
        if (!currentUser) {
          // console.log("User NOT FOUND...");  // Log when userName is missing
          return res.status(404).json({ message: 'User not found' });
        }
        else
        {
          const transactions=currentUser.transactions;
          return res.status(200).json({success:true, transactions})
        }
      }catch(e){
        return res.status(500).json({ message: "Server error" });
      }
    }
    
    module.exports = {
      fetchTransactionController,
      fetchTransactionsForGraphsController
    };


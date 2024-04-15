const Transaction = require('../models/transactionSchema.js');

const deleteTransactionController=async (req,res)=>{
  try {
    const userName = req.query.userName;
    const id = req.query.id;
    const Month = req.query.Month;

    const user = await Transaction.findOne({ userTransactions: userName });

    if (!user) {
      return res.status(404).json({ message: "Something went wrong." });
    }

    /*
    .findIndex(...): The findIndex method is an array method in JavaScript. It's used to find the index 
    of the first element in an array that satisfies a provided testing function. It takes a callback function as an argument.
    transaction => transaction.id === parseInt(id): This is an arrow function that is used as the testing function for findIndex. It takes a transaction as an argument (representing an element in the transactionHistory array), 
    and it checks if the id property of that transaction is equal to the parsed integer value of the id parameter.
    transaction.id: This assumes that each transaction object has an id property.
    parseInt(id): This converts the id parameter to an integer. The parseInt function parses a string and returns an integer.
    */
    const transactionMonthIndex = user.transactions.findIndex(transaction => transaction.month == Month);

    const transactionToBeDeletedIndex = user.transactions[transactionMonthIndex].transactionDetails.findIndex(transaction => transaction.id == id);

    const costOfDeletedTransaction = user.transactions[transactionMonthIndex].transactionDetails[transactionToBeDeletedIndex].cost;
    // console.log("Monthindex",transactionMonthIndex);
    // console.log("INdex",transactionToBeDeletedIndex); 
    
    user.transactions[transactionMonthIndex].transactionDetails.splice(transactionToBeDeletedIndex, 1);

    user.transactions[transactionMonthIndex].total-=costOfDeletedTransaction;


    // Remove the transaction from the array using filter
    // currentUser.transactionHistory[transactionMonthIndex].transactionDetails = currentUser.transactionHistory[transactionMonthIndex].transactionDetails.filter(
    //   (transaction) => transaction.id.toString() !== id
    // );
    await user.save();

    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports =deleteTransactionController;
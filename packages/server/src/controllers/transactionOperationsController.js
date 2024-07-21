const Transaction = require('../models/transactionSchema');
const User = require('../models/userSchema.js');

async function generateTransactionId() {
  const timestamp = new Date().getTime();
  const randomComponent = Math.floor(Math.random() * 90000) + 10000;
  const uniqueRandomNumber = parseInt(`${timestamp}${randomComponent}`);
  return uniqueRandomNumber;
}

const saveTransaction = async (req, res) => {
  try {
    const { description, cost, date, userName, newMonth, prevMonth } = req.body;
    console.log(req.body);

    const user = await Transaction.findOne({ userTransactions: userName });
    const transactionId = await generateTransactionId();



    if (!user) { //This is the first transaction of the user
      const transaction = new Transaction({
        userTransactions: userName,
        transactions: [{
          month: newMonth,
          total: cost,
          transactionDetails: [{
            id: transactionId,
            description: description,
            cost: cost,
            date: date,
          }]
        }]
      });
      await transaction.save();
      res.status(200).json({ message: 'Transaction added successfully [First user transaction]' });
    }
    else {  //User already has transaction you just need to push it in the proper month
      const targetMonthIndex = user.transactions.findIndex(transaction => transaction.month == newMonth);

      if (targetMonthIndex != -1) { //The month exists
        const updatedTotal = user.transactions[targetMonthIndex].total + parseInt(cost);
        // console.log("updated total",updatedTotal);
        user.transactions[targetMonthIndex].total = updatedTotal;
        user.transactions[targetMonthIndex].transactionDetails.push({
          id: transactionId,
          description: description,
          cost: cost,
          date: date,
        })
      }
      else { //The month does not exist hence you need to make one save 
        user.transactions.push({
          month: newMonth,
          total: cost,
          transactionDetails: [{
            id: transactionId,
            description: description,
            cost: cost,
            date: date,
          }]

        })
      }

      await user.save();
      res.status(200).json({ message: 'Transaction pushed successfully' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}




const fetchTransaction = async (req, res) => {
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

      if (month == "All") {
        let allTransactions = [];
        let totalExpenditure = 0;

        currentUser.transactions.forEach((tran) => {
          totalExpenditure += tran.total;
          tran.transactionDetails.forEach((trans) => {
            allTransactions.push(trans);
          });
        });

        return res.status(200).json({ success: true, transactions: allTransactions, monthTotal: totalExpenditure });

      } else {
        const transactions = await currentUser.transactions.find(en => en.month == month);

        if (!transactions) {
          return res.status(200).json({ success: false, message: "No transaction for that month" });
        } else {
          return res.status(200).json({ success: true, transactions: transactions.transactionDetails, monthTotal: transactions.total });
        }
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

const fetchTransactionsForGraphs = async (req, res) => {
  try {
    const { userName } = req.query;
    const currentUser = await Transaction.findOne({ userTransactions: userName });
    if (!currentUser) {
      // console.log("User NOT FOUND...");  // Log when userName is missing
      return res.status(404).json({ message: 'User not found' });
    }
    else {
      const transactions = currentUser.transactions;
      return res.status(200).json({ success: true, transactions })
    }
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}


// --------------------------------------------------------------------------

const updateTransaction = async (req, res) => {
  try {
    const { description, cost, date, userName, newMonth, prevMonth, id } = req.query;

    const user = await Transaction.findOne({ userTransactions: userName });


    if (user) {
      if (prevMonth === newMonth) { // No change in the month

        const transaction = user.transactions.find(t => t.month == newMonth);
        const oldMonthTotal = transaction.total;
        console.log("OldMonth: ", oldMonthTotal);
        const oldTransactionCost = transaction.transactionDetails.find(t => t.id == id);

        console.log("Transaction", oldTransactionCost.cost);
        const updatedMonthTotal = parseInt(oldMonthTotal) - parseInt(oldTransactionCost.cost) + parseInt(cost);
        console.log("Cost", cost);
        console.log("UpdatedMonth: ", updatedMonthTotal);

        const updatedTransaction = await Transaction.findOneAndUpdate(
          {
            userTransactions: userName,
            'transactions.month': newMonth,
            'transactions.transactionDetails.id': id
          },
          {
            $set: {
              'transactions.$[monthElem].transactionDetails.$[elem].description': description,
              'transactions.$[monthElem].transactionDetails.$[elem].cost': cost,
              'transactions.$[monthElem].transactionDetails.$[elem].date': date,
              'transactions.$[monthElem].total': updatedMonthTotal, // Adjust the total
            },
          },
          {
            new: true,
            arrayFilters: [{ 'monthElem.month': newMonth }, { 'elem.id': id }]
          }
        );




        if (updatedTransaction) {
          return res.status(200).json({ message: 'Transaction updated successfully' });
        } else {
          return res.status(404).json({ message: 'Transaction not found' });
        }
      } else {   //Transaction is in new month
        const newTransaction = {
          id: id,
          description: description,
          cost: cost,
          date: date
        };

        const transaction = user.transactions.find(t => t.month == prevMonth); //Find the transaction for prevMonth (old month)
        const oldTransactionCost = transaction.transactionDetails.find(t => t.id == id).cost;

        const updatedMonthTotal = parseInt(transaction.total) - parseInt(oldTransactionCost);

        // Find the index of the transaction to be deleted within the previous month
        const transactionIndexToBeDeleted = user.transactions.findIndex(t => t.month === prevMonth);

        if (transactionIndexToBeDeleted !== -1) {

          await Transaction.findOneAndUpdate(
            {
              userTransactions: userName,
              'transactions.month': prevMonth
            },
            {
              $pull: { 'transactions.$.transactionDetails': { id: id } },
              $set: { 'transactions.$.total': updatedMonthTotal }
            },
            { new: true }
          );
          console.log('Transaction deleted successfully.');
        } else {
          console.log('Transaction not found for specified prevMonth');
        }


        // Adding the transaction to the new month
        const newMonthForTransactionIndex = user.transactions.findIndex(t => t.month === newMonth); //Find index of new month

        if (newMonthForTransactionIndex !== -1) { // The month new month exists in the database
          user.transactions[newMonthForTransactionIndex].transactionDetails.push(newTransaction);
          user.transactions[newMonthForTransactionIndex].total = parseInt(user.transactions[newMonthForTransactionIndex].total) + parseInt(cost);
        } else { // The month doesn't exist in the database hence create that new month for this transaction to be added
          user.transactions.push({ month: newMonth, total: cost, transactionDetails: [newTransaction] });
        }

        await user.save();
        return res.status(200).json({ message: 'Transaction updated successfully' });
      }
    } else {
      return res.status(404).json({ message: 'User not found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}





const deleteTransaction = async (req, res) => {
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

    user.transactions[transactionMonthIndex].total -= costOfDeletedTransaction;



    await user.save();

    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { saveTransaction, fetchTransaction, fetchTransactionsForGraphs, updateTransaction, deleteTransaction };

const Transaction = require('../models/transactionSchema');

async function generateTransactionId() {
  const timestamp = new Date().getTime();
  const randomComponent = Math.floor(Math.random() * 90000) + 10000;
  const uniqueRandomNumber = parseInt(`${timestamp}${randomComponent}`);
  return uniqueRandomNumber;
}

const saveTransactionController = async (req, res) => {
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
          total:cost,
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
      
      if (targetMonthIndex!=-1) { //The month exists
        const updatedTotal=user.transactions[targetMonthIndex].total+parseInt(cost); 
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
            total:cost, 
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

module.exports = saveTransactionController;

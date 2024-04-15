const Transaction = require('../models/transactionSchema.js');

const updateTransactionController = async (req, res) => {
    try {
        const { description, cost, date, userName, newMonth, prevMonth, id } = req.query;

        const user = await Transaction.findOne({ userTransactions: userName });

        if (user) {
            if (prevMonth === newMonth) { // No change in the month
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
            } else { // Month got updated hence now you have to delete it from the prev month and put it in new month
                const newTransaction = {
                    id: id,
                    description: description,
                    cost: cost,
                    date: date
                };

                // Find the index of the transaction to be deleted within the previous month
                const transactionIndexToBeDeleted = user.transactions.findIndex(t => t.month === prevMonth);

                if (transactionIndexToBeDeleted !== -1) {
                    // Use $pull to remove the transaction from the transactionDetails array
                    await Transaction.findOneAndUpdate(
                        { userTransactions: userName, 'transactions.month': prevMonth },
                        { $pull: { 'transactions.$.transactionDetails': { id: id } } },
                        { new: true }
                    );
                    console.log('Transaction deleted successfully.');
                } else {
                    console.log('Transaction not found for specified prevMonth');
                }

                // Adding the transaction to the new month
                const newMonthForTransactionIndex = user.transactions.findIndex(t => t.month === newMonth);

                if (newMonthForTransactionIndex !== -1) { // The month new month exists in the database
                    user.transactions[newMonthForTransactionIndex].transactionDetails.push(newTransaction);
                } else { // The month doesn't exist in the database hence create that new month for this transaction to be added
                    user.transactions.push({ month: newMonth, transactionDetails: [newTransaction] });
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

module.exports =updateTransactionController ;

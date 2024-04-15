const Bills = require('../models/billSchema.js');

//Below is the redundant function try to make it as a component and export in future versions
async function generateId() {
    const timestamp = new Date().getTime();
    const randomComponent = Math.floor(Math.random() * 90000) + 10000;
    const uniqueRandomNumber = parseInt(`${timestamp}${randomComponent}`);
    return uniqueRandomNumber;
}

const saveBillReminderController = async (req, res) => {
    try {
        const { userName, description, cost, dueDate } = req.body;
        console.log("Bill data", req.body);

        const user = await Bills.findOne({ userBills: userName });
        const billId = await generateId();

        if (!user) { //This is the first bill reminder of the user 
            const billData = new Bills({
                userBills: userName,
                bills: [{
                    billId: billId,
                    billDescription: description,
                    billAmount: cost,
                    billDueDate: dueDate,
                }]
            })

            await billData.save();
            res.status(200).json({ message: 'Bill added successfully [First Bill]' });
        } else { //User already has some bills just need to push the new bill 
            user.bills.push({
                billId: billId,
                billDescription: description,
                billAmount: cost,
                billDueDate: dueDate,
            })

            user.save();
            res.status(200).json({ message: 'Bill added successfully [Other bills]' });
        }
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports =saveBillReminderController;
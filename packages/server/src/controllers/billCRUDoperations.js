const Bills = require('../models/billSchema.js');

//Below is the redundant function try to make it as a component and export in future versions
async function generateId() {
    const timestamp = new Date().getTime();
    const randomComponent = Math.floor(Math.random() * 90000) + 10000;
    const uniqueRandomNumber = parseInt(`${timestamp}${randomComponent}`);
    return uniqueRandomNumber;
}

const saveBillReminder = async (req, res) => {
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

const fetchBillAlert = async (req, res) => {
    const { userName } = req.query;
    try {
        const todaysDate = new Date();

        const user = await Bills.findOne({ userBills: userName });

        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        if (!user || !user.bills) {
            return res.status(200).json({ success: true, alertBills: [] }); // Return an empty array if user or user.bills is null/undefined
        }

        let alertBills = user.bills.filter(bill => {
            const billDueDate = new Date(bill.billDueDate);
            return billDueDate <= threeDaysFromNow && billDueDate>=todaysDate ;
        });

        console.log(alertBills);

        res.status(200).json({ success: true, alertBills });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const fetchBills = async (req, res) => {
    async function fetchBillsFromDB({ userName, activeStatus }) {
        try {
            const todaysDate = new Date();

            const user = await Bills.findOne({ userBills: userName });

            if (!user || !user.bills) {
                return []; // Return an empty array if user or user.bills is null/undefined
            }

            let activeBills; 

            if (activeStatus == 1) {
                activeBills = user.bills.filter(bill => new Date(bill.billDueDate) >= todaysDate);
            } else {
                activeBills = user.bills.filter(bill => new Date(bill.billDueDate) < todaysDate);
            }

            return activeBills;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    try {
        console.log('Fetching  bills');
        const { userName, activeStatus } = req.query;
        console.log(userName);
        console.log(activeStatus);

        if (!userName) {
            return res.status(400).json({ success: false, message: "User name is required" });
        }

        const activeBills = await fetchBillsFromDB({ userName, activeStatus });

        console.log(activeBills);
        res.status(200).json({ success: true, activeBills });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteBillReminder = async (req, res) => {
    try {
        console.log("Delete Bill Reminder!!!");
        const { billId, userName } = req.query;

        const user = await Bills.findOne({ userBills: userName });

        if (!user) {
            return res.status(404).json({ message: "Something went wrong." });
        }

        const billToBeDelted = user.bills.findIndex(bill => bill.billId == billId);

        user.bills.splice(billToBeDelted, 1);

        await user.save();

        return res.status(200).json({ message: "Bill deleted successfully." });

    }catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}


module.exports ={saveBillReminder,fetchBillAlert,fetchBills,deleteBillReminder};
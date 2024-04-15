const Bills = require('../models/billSchema.js');

const fetchBillsController = async (req, res) => {
    async function fetchBillsFromDB({ userName, activeStatus }) {
        try {
            const todaysDate = new Date();

            const user = await Bills.findOne({ userBills: userName });

            if (!user || !user.bills) {
                return []; // Return an empty array if user or user.bills is null/undefined
            }

            let activeBills; // Define activeBills here

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

module.exports = fetchBillsController;

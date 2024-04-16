const Bills = require('../models/billSchema.js');

const fetchBillAlertController = async (req, res) => {
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

module.exports = fetchBillAlertController;

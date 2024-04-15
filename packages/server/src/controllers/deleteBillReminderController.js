const Bills = require('../models/billSchema.js');

const deleteBillReminderController = async (req, res) => {
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

module.exports = deleteBillReminderController;
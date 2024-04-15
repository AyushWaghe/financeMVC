const registerRoute = require('./src/routes/registerRoute.js');
const saveTransactionRoute = require('./src/routes/saveTransactionRoute.js');
const fetchTransactionsRoute = require('./src/routes/fetchTransactionRoute.js');
const deleteTransactionRoute = require('./src/routes/deleteTransactionRoute.js');
const billReminderRoute = require('./src/routes/billReminderRoute.js');
const {connectDB}=require('./dbConfig/db.js');

const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
// const { default: fetchTransactions } = require('../client/src/components/Functions/Fetchtransactions.js');
const app = express();
const port = 3001;

connectDB();


app.use(cors());
app.use(bodyParser.json());

//Transaction routes
app.use('/register',registerRoute);
app.use('/getTransactionAndStoreThem',saveTransactionRoute);
app.use('/fetchTransactions',fetchTransactionsRoute);
app.use('/deleteTransaction',deleteTransactionRoute);

//Bill rountes 
app.use('/BillReminders',billReminderRoute);




app.get('/', (req, res) => {
  res.send('Hello, World!');
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

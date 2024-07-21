const registerRoute = require('./src/routes/registerRoute.js');
const billReminderRoute = require('./src/routes/billReminderRoute.js');
const {connectDB}=require('./dbConfig/db.js');
const transactionOperationsRoute=require('./src/routes/transactionOperationsRoute.js')

const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
// const { default: fetchTransactions } = require('../client/src/components/Functions/Fetchtransactions.js');
const app = express();
const port = 3001;

connectDB();


app.use(cors());
app.use(bodyParser.json());

//Authentication route

app.use('/register',registerRoute);


//Transaction routes
app.use('/transactionOperation',transactionOperationsRoute);

//Bill rountes 
app.use('/BillReminders',billReminderRoute);




app.get('/', (req, res) => {
  res.send('Hello, World!');
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

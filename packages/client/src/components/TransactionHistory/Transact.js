import React, { useState, useEffect } from 'react';
import Field from './Field';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/TransactionHistory.css';
import SideNavBar from '../SideNavBar/SideNavBar';

function Transact() {

  const [navBarisToggle, setNavBarisToggle] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [monthTotal, setMonthTotal] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');
  const [prevMonth, setPrevMonth] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const MonthNumber = formatDate(Date.now()).substring(5, 7);
  var Month = null;
  const [appliedMonth, setAppliedMonth] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  var todaysDate;
  const [monthToBeSendToFieldComponent, setMonthToBeSentTo] = useState('');


  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
  }

  const user = useSelector((state) => state.user);
  const userName = user.user.userName;

  let monthsMap = new Map();
  monthsMap.set("01", "January");
  monthsMap.set("02", "February");
  monthsMap.set("03", "March");
  monthsMap.set("04", "April");
  monthsMap.set("05", "May");
  monthsMap.set("06", "June");
  monthsMap.set("07", "July");
  monthsMap.set("08", "August");
  monthsMap.set("09", "September");
  monthsMap.set("10", "October");
  monthsMap.set("11", "November");
  monthsMap.set("12", "December");


  function formatDate(inputDate) {
    const currentDate = inputDate ? new Date(inputDate) : new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${year}-${month}-${day}`;
  }

  const fetchTransactions = async () => {
    // setMonth(monthsMap.get(MonthNumber));
    Month = monthsMap.get(MonthNumber);
    // console.log("RHis Month:",Month);
    try {
      if (hasApplied) {
        // console.log("Applied");
        const response = await axios.get(`https://financemvc.onrender.com/fetchTransactions/fetch?userName=${userName}&month=${appliedMonth}`);
        setTransactions(response.data.transactions);
        setMonthTotal(response.data.monthTotal);
        console.log("Transactions:", response.data.transactions);
      } else {
        // console.log("Not appleid");
        const response = await axios.get(`https://financemvc.onrender.com/fetchTransactions/fetch?userName=${userName}&month=${Month}`);
        setTransactions(response.data.transactions);
        setMonthTotal(response.data.monthTotal);
        console.log("Transactions:", response.data.transactions);
      }
      // console.log("Transactions:",transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasApplied(false);

    let dateToUse = date || todaysDate;

    if (date.trim() === '') {

      dateToUse = formatDate(Date.now());
    }

    var submittedMonthNumber = dateToUse.substring(5, 7);
    const submittedMonth = monthsMap.get(submittedMonthNumber);
    const transactionData = {
      description: description,
      cost: cost,
      date: dateToUse,
      userName: userName,
      newMonth: submittedMonth,
      prevMonth: prevMonth,
    };

    console.log("Transaction Data is:", transactionData);

    if (isUpdating) {
      console.log("Updating data", transactionData);
      try {
        await axios.post(`https://financemvc.onrender.com/getTransactionAndStoreThem/updateTransaction`, null, {
          params: {
            ...transactionData,
            id: currentTransactionId,
          },
        });
        setIsUpdating(false);
        setCurrentTransactionId(null);
      } catch (error) {
        console.error('Error updating transaction:', error.message);
      }
    } else {
      try {
        await axios.post('https://financemvc.onrender.com/getTransactionAndStoreThem/saveTransaction', transactionData);
      } catch (error) {
        console.error('Error creating transaction:', error.message);
      }
    }

    setDescription('');
    setCost('');
    setDate('');
    fetchTransactions();
  };

  const handleAppliedMonthFilter = async (e) => {
    setHasApplied(true);
    setMonthToBeSentTo(appliedMonth);
    fetchTransactions();
  }

  const handleEdit = (transactionId) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (transaction) {
      setDescription(transaction.description);
      setCost(transaction.cost);
      setDate(transaction.date);
      setPrevMonth(monthsMap.get(transaction.date.substring(5, 7))); // Set the prevMonth state with the selected month
      setCurrentTransactionId(transactionId);
      setIsUpdating(true);
    }
  };


  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setCurrentTransactionId(null);
    setDescription('');
    setCost('');
    setDate('');
  };

  useEffect(() => {
    if (!hasApplied) {
      setAppliedMonth(Month);
    }
  }, [hasApplied, Month]);


  useEffect(() => {
    fetchTransactions();
  }, []);

  // console.log("Halala",monthToBeSendToFieldComponent);


  return (
    <div className="transaction-history-container">
      <div >
        <SideNavBar
          isToggle={setNavBarTogggle}
        />
      </div>

      {navBarisToggle && <div className="Model"></div>}
      <div className="card2">
        <h2>Transaction History</h2>
        <div className="input-area">
          <form className="transaction-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                className="input-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="cost">Cost:</label>
              <input
                type="text"
                id="cost"
                name="cost"
                className="input-field"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="button-container">
              <button type="submit" className="submit-button">
                {isUpdating ? 'Update' : 'Submit'}
              </button>
              {isUpdating && (
                <button type="button" className="cancel-button" onClick={handleCancelUpdate}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="form-row">
          <label htmlFor="month">Filter:</label>
          <select
            id="month"
            name="month"
            className="input-field"
            value={Month}
            onChange={(e) => setAppliedMonth(e.target.value)}
          >
            <option value="">Select a month</option>
            <option value="All">All</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <div className="ApplyButton">
            <button onClick={handleAppliedMonthFilter}>Apply</button>
          </div>
              (If no date selected for saving transaction, then transaction gets saved on todays date)
        </div>

      </div>
      <Field
        Month={monthToBeSendToFieldComponent}
        transactions={transactions}
        onDelete={fetchTransactions}
        onEdit={handleEdit}
        total={monthTotal}
      />
    </div>
  );
}

export default Transact;

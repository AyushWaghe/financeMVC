import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Field from './Field';
import axios from 'axios';
import './TransactionHistory.css';
import SideNavBar from '../SideNavBar/SideNavBar';
import api from '../../api/AxiosConfig';


function Transact() {
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];

  const [navBarisToggle, setNavBarisToggle] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [monthTotal, setMonthTotal] = useState('');
  const [monthStats, setMonthStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalNeedsExpense: 0,
    totalWantsExpense: 0,
    totalSavings: 0
  });

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');

  const [transactionsError, setTransactionsError] = useState("");
  const [statsError, setStatsError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [finalSelectedYear, setFinalSelectedYear] = useState(new Date().getFullYear());

  const [isUpdating, setIsUpdating] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [spendingType, setSpendingType] = useState('NEEDS');

  const user = useSelector((state) => state.user);
  const userId = user.user.userId;

  const [selectedMonthName, setSelectedMonthName] = useState(months.find((month) => month.value === new Date().getMonth() + 1)?.label);

  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
  };

  const formatDate = (inputDate) => {
    const currentDate = inputDate ? new Date(inputDate) : new Date();

    if (isNaN(currentDate.getTime())) return '';

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleTransactionTypeChange = (e) => {
    const selectedType = e.target.value;

    setTransactionType(selectedType);

    if (selectedType === "INCOME") {
      setSpendingType("NA");
    } else {
      setSpendingType("NEEDS");
    }
  };

  const fetchTransactions = async () => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    setTransactionsError("");
    setStatsError("");

    try {
      const transactionsResponse = await api.get(
        `/transactions/monthly?userId=${userId}&month=${month}&year=${year}`,
        {
          withCredentials: true //This tells Axios to send and receive cookies. 
        });

      setTransactions(transactionsResponse.data.data);
      setMonthTotal(transactionsResponse.data.monthTotal);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      setTransactions([]);
      setMonthTotal('');
      setTransactionsError("Unable to fetch transactions for this month.");
    }

    try {
      const statsResponse = await api.get(
        `/analytics/month-stats/user/${userId}?month=${month}&year=${year}`, {
        withCredentials: true //This tells Axios to send and receive cookies. 
      }
      );

      setMonthStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching monthly stats:', error.message);
      setMonthStats({
        totalIncome: 0,
        totalExpense: 0,
        totalNeedsExpense: 0,
        totalWantsExpense: 0,
        totalSavings: 0
      });
      setStatsError("Unable to fetch monthly stats. Try after some time");
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateToUse = date ? formatDate(date) : formatDate(Date.now());

    const transactionData = {
      userId: userId,
      title: title,
      description: description,
      amount: cost,
      category: category,
      transactionDate: dateToUse,
      type: transactionType,
      spendingType: transactionType === "INCOME" ? "NA" : spendingType
    };

    if (isUpdating) {
      try {
        await api.put(
          `/transactions/${currentTransactionId}`,
          transactionData, {
          withCredentials: true //This tells Axios to send and receive cookies. 
        }
        );

        setIsUpdating(false);
        setCurrentTransactionId(null);
      } catch (error) {
        console.error('Error updating transaction:', error);
      }
    } else {
      try {
        const response = await api.post(
          '/transactions',
          transactionData, {
          withCredentials: true //This tells Axios to send and receive cookies. 
        }
        );

        if (!response.data.success) {
          alert("Something went wrong");
          throw new Error("Failed to save the transaction");
        }
      } catch (error) {
        console.error('Error creating transaction:', error.message);
      }
    }

    setDescription('');
    setCost('');
    setDate('');
    setTitle('');
    setCategory('');
    setTransactionType("EXPENSE");
    setSpendingType("NEEDS");

    fetchTransactions();
  };

  const handleAppliedMonthFilter = () => {
    fetchTransactions();
    setSelectedMonthName(months.find((month) => month.value === selectedMonth)?.label);
    setFinalSelectedYear(selectedYear);
  };

  const handleClearFilter = () => {
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
  };

  const handleEdit = (transactionId) => {
    const transaction = transactions.find((t) => t.transactionId === transactionId);

    if (transaction) {
      setTitle(transaction.title);
      setDescription(transaction.description);
      setCost(transaction.amount);
      setCategory(transaction.category);
      setDate(transaction.transactionDate);
      setCurrentTransactionId(transactionId);
      setTransactionType(transaction.type);
      setSpendingType(transaction.type === "INCOME" ? "NA" : transaction.spendingType);
      setIsUpdating(true);
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setCurrentTransactionId(null);
    setDescription('');
    setCost('');
    setDate('');
    setTitle('');
    setCategory('');
    setTransactionType("EXPENSE");
    setSpendingType("NEEDS");
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transaction-history-container">
      <SideNavBar isToggle={setNavBarTogggle} />

      {navBarisToggle && <div className="Model"></div>}

      {/* <div className="navbar-wrapper">
        <Navbar
          onProfileClick={() => navigate("/profile")}
          onLogout={() => navigate("/login")}
        />
      </div> */}

      <div className="page-content">


        <div className="transaction-page">
          <div className="transaction-header">
            <div>
              <h2>Transaction History</h2>
              <h2>{selectedMonthName} {finalSelectedYear}</h2>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stats-card income-card">
              <span>Total Income</span>
              <strong>₹{formatAmount(monthStats.totalIncome)}</strong>
            </div>

            <div className="stats-card expense-card">
              <span>Total Expense</span>
              <strong>₹{formatAmount(monthStats.totalExpense)}</strong>
            </div>

            <div className="stats-card needs-card">
              <span>Needs Expense</span>
              <strong>₹{formatAmount(monthStats.totalNeedsExpense)}</strong>
            </div>

            <div className="stats-card wants-card">
              <span>Wants Expense</span>
              <strong>₹{formatAmount(monthStats.totalWantsExpense)}</strong>
            </div>

            <div className="stats-card savings-card">
              <span>Total Savings</span>
              <strong>₹{formatAmount(monthStats.totalSavings)}</strong>
            </div>
          </div>

          {statsError && <p className="error-message">{statsError}</p>}

          <div className="filter-panel">
            <div className="filter-title">Monthly Filter</div>

            <div className="filter-controls">
              <div className="form-row">
                <label htmlFor="selectedMonth">Month</label>
                <select
                  id="selectedMonth"
                  name="selectedMonth"
                  className="input-field"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="selectedYear">Year</label>
                <input
                  type="number"
                  id="selectedYear"
                  name="selectedYear"
                  className="input-field"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                />
              </div>

              <button type="button" className="filter-button" onClick={handleAppliedMonthFilter}>
                Apply Filter
              </button>

              <button type="button" className="clear-button" onClick={handleClearFilter}>
                Clear
              </button>
            </div>
          </div>

          <div className="form-panel">
            <h3>{isUpdating ? 'Update Transaction' : 'Add Transaction'}</h3>

            <form className="transaction-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="form-row">
                <label htmlFor="cost">Amount</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  className="input-field"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  min="0.0"
                  max="10000000.0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="input-field"
                  value={date}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label htmlFor="transactionType">Type</label>
                <select
                  id="transactionType"
                  name="transactionType"
                  className="input-field"
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                >
                  <option value="INCOME">INCOME</option>
                  <option value="EXPENSE">EXPENSE</option>
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  maxLength={25}
                />
              </div>

              <div className="form-row">
                <label htmlFor="spendingType">Spending Type</label>
                <select
                  id="spendingType"
                  name="spendingType"
                  className="input-field"
                  value={spendingType}
                  onChange={(e) => setSpendingType(e.target.value)}
                  disabled={transactionType === "INCOME"}
                >
                  {transactionType === "INCOME" && <option value="NA">NA</option>}
                  <option value="NEEDS">NEEDS</option>
                  <option value="WANTS">WANTS</option>
                  <option value="SAVINGS">SAVINGS</option>
                </select>
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

          {transactionsError && <p className="error-message">{transactionsError}</p>}

          <Field
            Month={selectedMonthName}
            transactions={transactions}
            onDelete={fetchTransactions}
            onEdit={handleEdit}
            total={monthTotal}
            year={finalSelectedYear}
          />
        </div>
      </div>
    </div>
  );
}

export default Transact;
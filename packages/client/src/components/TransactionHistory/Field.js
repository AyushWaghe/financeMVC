import React from 'react';
import { useSelector } from 'react-redux';
import '../../assets/FieldStyle.css';
import {api} from '../../api/AxiosConfig';

function Field({ transactions, onDelete, onEdit, Month,total,year }) {

  const user = useSelector((state) => state.user);

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


  const handleDelete = async (id,date) => {
    const monthNumber=date.substring(5, 7);
    const Month=monthsMap.get(monthNumber);
    console.log("Month",Month);
    try {
      await api.delete(`/transactions/${id}`,{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      onDelete();
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="field-container">
      <div className="Month">
        <h1 className="MonthHeader">{Month} {year}</h1>
      </div>
      <table className="field-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>INCOME/EXPENSE</th>
            <th>Spending Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!transactions || transactions.length === 0 ? (
            <tr>
              <td colSpan="8">No transactions to display</td>
            </tr>
          ) : (
            transactions &&
            transactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.transactionDate}</td>
                <td>{transaction.type}</td>
                <td>{transaction.spendingType}</td>
                <td>
                  <button onClick={() => handleDelete(transaction.transactionId,transaction.transactionDate)}>
                    Delete
                  </button>
                  <button onClick={() => onEdit(transaction.transactionId)}>
                    Update
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Field;

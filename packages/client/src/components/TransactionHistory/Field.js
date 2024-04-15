import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/FieldStyle.css';

function Field({ transactions, onDelete, onEdit, Month,total }) {
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


  const handleDelete = async (id,date) => {
    const monthNumber=date.substring(5, 7);
    const Month=monthsMap.get(monthNumber);
    console.log("Month",Month);
    try {
      await axios.delete('http://localhost:3001/deleteTransaction/delete', {
        params: {
          id: id,
          userName: userName,
          Month:Month,
        },
      });
      onDelete();
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="field-container">
      <div className="Month">
        <h1 className="MonthHeader">{Month}</h1>
      </div>
      <table className="field-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Cost</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions && transactions.length === 0 ? (
            <tr>
              <td colSpan="4">No transactions to display</td>
            </tr>
          ) : (
            transactions &&
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>{transaction.cost}</td>
                <td>{transaction.date}</td>
                <td>
                  <button onClick={() => handleDelete(transaction.id,transaction.date)}>
                    Delete
                  </button>
                  <button onClick={() => onEdit(transaction.id)}>
                    Update
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tbody>
            <tr className="TotalSpan">
              <td>Month Total</td>
              <td></td>
              <td></td>
              <td>{total}</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Field;

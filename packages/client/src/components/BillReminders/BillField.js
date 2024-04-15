import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/FieldStyle.css';

function BillField({bills,onDelete}) {
  console.log(bills);
  const user = useSelector((state) => state.user);
  const userName = user.user.userName;

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost:3001/BillReminders/deleteBill', {
        params: {
          billId: id,
          userName: userName,
        },
      });
      onDelete();
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="field-container">
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
          {bills && bills.length === 0 ? (
            <tr>
              <td colSpan="4">No bills to display</td>
            </tr>
          ) : (
            bills &&
            bills.map((bill) => (
              <tr key={bill.billId}>
                <td>{bill.billDescription}</td>
                <td>{bill.billAmount}</td>
                <td>{bill.billDueDate}</td>
                <td>
                  <button onClick={() => handleDelete(bill.billId)}>
                    Delete
                  </button>
                  {/* <button onClick={() => onEdit(bill.id)}>
                    Update
                  </button> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BillField;

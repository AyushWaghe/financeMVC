import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/FieldStyle.css';
import {api} from '../../api/AxiosConfig';

function BillField({bills,onDelete,handleUpdate}) {
  console.log(bills);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bill/${id}`,{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      onDelete();
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="field-container">
    <div>
      <h1>BILLS</h1>
    </div>
      <table className="field-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Recurrence</th>
            <th>Recurrence due date</th>
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
                <td>{bill.title}</td>
                <td>{bill.amount}</td>
                <td>{bill.billRecurrence}</td>
                <td>{bill.dueDate}</td>
                <td>
                  <button onClick={() => handleDelete(bill.billId)}>
                    Delete
                  </button>
                  <button onClick={() => handleUpdate(bill.billId)}>
                    Update
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

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/FieldStyle.css';
import api from '../../api/AxiosConfig';

function BillInstanceField({ bills, onDelete, sectionTitle, status }) {
  // console.log(bills);

  const [billStatus, setBillStatus] = useState('');

  const handleDelete = async (id) => {
    try {

      await api.delete(`/bill-instance/${id}`,{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      onDelete();
    } catch (e) {
      console.error(e.message);
    }
  };

  const onEdit = async (id, status) => {
    try {
      console.log("Bill status", billStatus);
      await api.patch('/bill-instance/mark-status', {
        billInstanceId: id,
        billStatus: billStatus
      },{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      onDelete();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="field-container">
      <div>
        <h1>{sectionTitle}</h1>
      </div>
      <table className="field-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Due date</th>
            <th>PAID/PENDING</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bills && bills.length === 0 ? (
            <tr>
              <td colSpan="5">NO {sectionTitle}</td>
            </tr>
          ) : (
            bills
              .map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.title}</td>
                  <td>{bill.amount}</td>
                  <td>{bill.dueDate}</td>
                  <td>
                    {<span className={`bill-status ${bill.billStatus === "PAID" ? "paid" : "pending"}`}>
                      {status}
                    </span>}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(bill.id)}>
                      Delete
                    </button>
                    {bill.billStatus === "PENDING" ? (<button onClick={() => { setBillStatus("PAID"); onEdit(bill.id); }} > Mark as Paid </button>) 
                    : (<button onClick={() => { setBillStatus("PENDING"); onEdit(bill.id); }} > Mark as Pending </button>)}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BillInstanceField;

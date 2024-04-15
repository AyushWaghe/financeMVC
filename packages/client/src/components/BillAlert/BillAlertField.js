import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../assets/FieldStyle.css';

function BillAlertField({bills}) {
  return (
    <div>
      <table className="field-table" style={{width:"275%"}}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Cost</th>
            <th>Date</th>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BillAlertField;

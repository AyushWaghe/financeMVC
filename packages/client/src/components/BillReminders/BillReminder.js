import React, { useEffect, useState } from "react";
import './BillReminderPage.css';
import BillField from './BillField.js';
import axios from "axios";
import { useSelector } from 'react-redux';
import SideNavBar from '../SideNavBar/SideNavBar';
import BillInstanceField from "./BillInstanceField.js";
import { faL } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/AxiosConfig";

const BillReminder = () => {

  const [navBarisToggle, setNavBarisToggle] = useState(false);

  const [handleSubmitStatus, setHandleSubmitStatus] = useState(false);

  const [title, settitle] = useState('');
  const [amount, setamount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [recurrenceType, setRecurrenceType] = useState('NONE');
  const [bills, setBills] = useState([]);
  const [billInstances, setBillInstances] = useState([]);
  const [overdueBillInstances, setOverdueBillInstances] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [billId,setBillId]=useState('');


  const user = useSelector((state) => state.user);
  const userId = user.user.userId;

  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
  }

  const fetchAllBills = async () => {
    fetchBillInstances();
    fetchBills();
  }

  const handleUpdate = (billId) => {
    setIsUpdating(true);
    setBillId(billId);
    const bill = bills.find((b) => b.billId === billId);
    settitle(bill.title);
    setDueDate(bill.dueDate);
    setamount(bill.amount);
    setRecurrenceType(bill.billRecurrence);
    fetchAllBills();
  }

  const fetchBills = async () => {
    try {
      const response = await api.get(`/bill/user/${userId}`,{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      setBills(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBillInstances = async () => {
    //Get bill instances of the user 
    try {
      const response = await api.get(`/bill-instance/upcoming/${userId}`,{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      setBillInstances(response.data.data);
      console.log("Bill instances", response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchOverDueBillInstances = async () => {
    //Get bill instances of the user 
    try {
      const response = await api.get(`/bill-instance/overdue/${userId}`,{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      setOverdueBillInstances(response.data.data);
      // console.log("Bill instances", response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  // console.log(bills);

  function formatDate(inputDate) {
    const currentDate = inputDate ? new Date(inputDate) : new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${year}-${month}-${day}`;
  }

  let dateToUse = formatDate(dueDate);


  const handleSubmit = async (e) => {
    setHandleSubmitStatus(!handleSubmitStatus);
    e.preventDefault();

    const billData = {
      userId: userId,
      title: title,
      amount: amount,
      dueDate: dateToUse,
    }

    if(isUpdating===true){
      billData.billRecurrence = recurrenceType;
      try {
        await api.put(`/bill/${billId}`, billData,{
          withCredentials:true //This tells Axios to send and receive cookies. 
        });
      } catch (e) {
        console.log(e);
      }
      setIsUpdating(false);
      settitle('');
      setamount('');
      setDueDate('');
      setRecurrenceType('NONE');
      fetchAllBills();
      return;
    }

    if (recurrenceType === "NONE") {
      billData.billStatus = "PENDING";
      try {
        await api.post('/bill-instance', billData,{
          withCredentials:true //This tells Axios to send and receive cookies. 
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      billData.billRecurrence = recurrenceType;
      try {
        await api.post('/bill', billData,{
          withCredentials:true //This tells Axios to send and receive cookies. 
        });
      } catch (e) {
        console.log(e);
      }
    }

    if (recurrenceType === "NONE") {
      fetchBillInstances();
    } else {
      fetchAllBills();
    }
    settitle('');
    setamount('');
    setDueDate('');
  };

  useEffect(() => {
    fetchAllBills();
    fetchOverDueBillInstances();
  }, []);

  return (
    <div className="BillReminderPageContainer">
      <div className="navBar">
        <SideNavBar
          isToggle={setNavBarTogggle}
        />
      </div>

      {navBarisToggle && <div className="Model"></div>}
      <div className="MasterContainer">
        <div className="card">
          <form onSubmit={handleSubmit} className="form">
            <div className="Container">
              <div className="form-group">
                <div className="des">
                  <label htmlFor="title">Title:</label>
                </div>

                <div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => settitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setamount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due:</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={dueDate}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recurrenceType">Recurrence Type:</label>
                <select
                  id="recurrenceType"
                  name="recurrenceType"
                  className="input-field"
                  value={recurrenceType}
                  onChange={(e) => setRecurrenceType(e.target.value)}
                >
                  {!isUpdating && <option value="NONE">NONE</option>}

                  <option value="DAILY">DAILY</option>
                  <option value="WEEKLY">WEEKLY</option>
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="QUARTERLY">QUARTERLY</option>
                  <option value="HALF_YEARLY">HALF_YEARLY</option>
                  <option value="YEARLY">YEARLY</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="submit"
                  value={isUpdating ? "Update" : "Submit"}
                />

                {isUpdating && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdating(false);
                      settitle('');
                      setamount('');
                      setBillId('');
                      setRecurrenceType('NONE');
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <BillField
          bills={bills}
          onDelete={fetchAllBills}
          handleUpdate={handleUpdate}
        />
        <BillInstanceField
          bills={billInstances}
          onDelete={fetchBillInstances}
          sectionTitle={"UPCOMING BILLS"}
          status={"PENDING"}
        />
        <BillInstanceField
          bills={overdueBillInstances}
          onDelete={fetchOverDueBillInstances}
          sectionTitle={"OVERDUE BILLS!"}
          status={"OVERDUE"}
        />
      </div>

    </div>

  );
};

export default BillReminder;

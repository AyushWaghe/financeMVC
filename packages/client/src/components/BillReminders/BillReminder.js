import React, { useEffect, useState } from "react";
import './BillReminderPage.css';
import BillField from './BillField.js';
import axios from "axios";
import { useSelector } from 'react-redux';
import SideNavBar from '../SideNavBar/SideNavBar';
import BillInstanceField from "./BillInstanceField.js";
import { faL } from "@fortawesome/free-solid-svg-icons";
import {api} from "../../api/AxiosConfig";
import { signup } from "../../features/userSlice";
import PageSizeDropDown from "../Widgets/PageSizeDropDown";
import PaginationControls from "../Widgets/PaginationControls";

const BillReminder = () => {

  const [navBarisToggle, setNavBarisToggle] = useState(false);

  const [handleSubmitStatus, setHandleSubmitStatus] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [page2, setPage2] = useState(0);
  const [totalPages2, setTotalPages2] = useState(0);
  const [pageSize2, setPageSize2] = useState(5);
  const [page3, setPage3] = useState(0);
  const [totalPages3, setTotalPages3] = useState(0);
  const [pageSize3, setPageSize3] = useState(5);
  const [title, settitle] = useState('');
  const [amount, setamount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [recurrenceType, setRecurrenceType] = useState('NONE');
  const [bills, setBills] = useState([]);
  const [billInstances, setBillInstances] = useState([]);
  const [overdueBillInstances, setOverdueBillInstances] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [billId, setBillId] = useState('');


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
      const response = await api.get(`/bill/user/${userId}`, {
        params: {
          page: page,
          size: pageSize
        },
        withCredentials: true //This tells Axios to send and receive cookies. 
      });
      // console.log("Resposne is", response);
      setBills(response.data.data.content);
      setTotalPages(response.data.data.totalPages)
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBillInstances = async () => {
    //Get bill instances of the user 
    try {
      const response = await axios.get(`/bill-instance/upcoming/${userId}`, {
        params: {
          page: page2,
          size: pageSize2
        },
        withCredentials: true //This tells Axios to send and receive cookies. 
      });
      setBillInstances(response.data.data.content);
      setTotalPages2(response.data.data.totalPages)
      // console.log("TOTAL PAGES", response.data.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchOverDueBillInstances = async () => {
    //Get bill instances of the user 
    try {
      const response = await api.get(`/bill-instance/overdue/${userId}`, {
        params: {
          page: page3,
          size: pageSize3
        },
        withCredentials: true //This tells Axios to send and receive cookies. 
      });
      setOverdueBillInstances(response.data.data.content);
      setTotalPages3(response.data.data.totalPages)
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

    if (isUpdating === true) {
      billData.billRecurrence = recurrenceType;
      try {
        await api.put(`/bill/${billId}`, billData, {
          withCredentials: true //This tells Axios to send and receive cookies. 
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
        await api.post('/bill-instance', billData, {
          withCredentials: true //This tells Axios to send and receive cookies. 
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      billData.billRecurrence = recurrenceType;
      try {
        await api.post('/bill', billData, {
          withCredentials: true //This tells Axios to send and receive cookies. 
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


  useEffect(() => {
    fetchBills();
  }, [page, pageSize]);

  useEffect(() => {
    fetchBillInstances();
  }, [page2, pageSize2]);

  useEffect(() => {
    fetchOverDueBillInstances();
  }, [page3, pageSize3]);

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
        <PageSizeDropDown
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPage={setPage} />
        <BillField
          bills={bills}
          onDelete={fetchAllBills}
          handleUpdate={handleUpdate}
        />
        <PaginationControls
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />

         <PageSizeDropDown
          pageSize={pageSize2}
          setPageSize={setPageSize2}
          setPage={setPage2} />
        <BillInstanceField
          bills={billInstances}
          onDelete={fetchBillInstances}
          sectionTitle={"UPCOMING BILLS"}
          status={"PENDING"}
        />
         <PaginationControls
          page={page2}
          setPage={setPage2}
          totalPages={totalPages2}
        />
        
        <PageSizeDropDown
          pageSize={pageSize3}
          setPageSize={setPageSize3}
          setPage={setPage3} />
        <BillInstanceField
          bills={overdueBillInstances}
          onDelete={fetchOverDueBillInstances}
          sectionTitle={"OVERDUE BILLS!"}
          status={"OVERDUE"}
        />
         <PaginationControls
          page={page3}
          setPage={setPage3}
          totalPages={totalPages3}
        />
        

      </div>

    </div>

  );
};

export default BillReminder;

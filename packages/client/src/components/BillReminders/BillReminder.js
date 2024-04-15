import React, { useEffect, useState } from "react";
import '../../assets/BillReminderPage.css';
import BillField from './BillField.js';
import axios from "axios";
import { useSelector } from 'react-redux';
import SideNavBar from '../SideNavBar/SideNavBar';

const BillReminder = () => {

  const [navBarisToggle, setNavBarisToggle] = useState(false);

  const [handleSubmitStatus,setHandleSubmitStatus] = useState(false);

  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [bills, setBills] = useState([]);

  const user = useSelector((state) => state.user);
  const userName = user.user.userName;

  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
  }

  const fetchActiveBills = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/BillReminders/fetchBills?userName=${userName}&activeStatus=${1}`);
      setBills(response.data.activeBills);
    } catch (err) {
      console.log(err.message);
    }
  };

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
      userName: userName,
      description: description,
      cost: cost,
      dueDate: dateToUse,
    }

    try {
      
      await axios.post('http://localhost:3001/BillReminders/saveBill', billData);
      console.log("Getaa billa");
    } catch (e) {
      console.log(e);
    }
    
    setDescription('');
    setCost('');
    setDueDate('');
    fetchActiveBills();
  };

  useEffect(() => {
    fetchActiveBills();
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
                  <label htmlFor="description">Description:</label>
                </div>

                <div>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="cost">Cost:</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  placeholder="Enter cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
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
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input type="submit" value="Submit" />
              </div>
            </div>
          </form>
        </div>
        <BillField
          bills={bills}
          onDelete={fetchActiveBills}
        />
      </div>
    </div>

  );
};

export default BillReminder;

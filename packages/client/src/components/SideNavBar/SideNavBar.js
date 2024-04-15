import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faNewspaper, faChartLine, faBell, faList, faHome } from '@fortawesome/free-solid-svg-icons';
import '../../assets/SideNavBar.css';

const SideNavBar = ({ isToggle }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = async () => {
    await setIsOpen(!isOpen);
    isToggle();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2>My App</h2>
      <div className="SideNavBarField" onClick={() => navigate("/Transact")}>
        <FontAwesomeIcon icon={faHistory} className="icon" /> <span className="text">Transaction history</span>
      </div>

      <div className="SideNavBarField" onClick={() => navigate("/Main")}>
        <FontAwesomeIcon icon={faNewspaper} className="icon" /> <span className="text">Financial News</span>
      </div>

      <div className="SideNavBarField" onClick={() => navigate("/Graphs")}>
        <FontAwesomeIcon icon={faChartLine} className="icon" /> <span className="text">Analytics</span>
      </div>

      <div className="SideNavBarField" onClick={() => navigate("/BillReminder")}>
        <FontAwesomeIcon icon={faBell} className="icon" /> <span className="text">Bill reminders</span>
      </div>

      <div className="SideNavBarField" onClick={() => navigate("/PastBills")}>
        <FontAwesomeIcon icon={faList} className="icon" /> <span className="text">Bill History</span>
      </div>

      <div className="SideNavBarField" onClick={() => navigate("/Home")}>
        <FontAwesomeIcon icon={faHome} className="icon" /> <span className="text">Home</span>
      </div>
      
      <div className="toggle-btn" onClick={handleToggle}>
        {isOpen ? 'Close' : 'Open'}
      </div>
    </div>
  );
};

export default SideNavBar;

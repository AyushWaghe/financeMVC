import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faNewspaper,
  faChartLine,
  faBell,
  faList,
  faHome,
  faUser,
  faRightFromBracket,
  faBars,
  faXmark,
  faRobot,
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons";
import "./SideNavBar.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";

const SideNavBar = ({ isToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((previousValue) => !previousValue);
    isToggle?.();
  };

  const handleLogout = async (event) => {
    event.stopPropagation();

    try {
      await axios.post(
        "http://localhost:8082/auth/logout",
        {},
        { withCredentials: true }
      );
    } finally {
      dispatch(logout({ userId: null }));
      navigate("/");
    }
  };

  const navigationItems = [
    { label: "Transaction History", icon: faHistory, path: "/Transact" },
    { label: "Financial News", icon: faNewspaper, path: "/Main" },
    { label: "Analytics", icon: faChartLine, path: "/Graphs" },
    { label: "Bill Reminders", icon: faBell, path: "/BillReminder" },
    { label: "Bill History", icon: faList, path: "/PastBills" },
    { label: "Home", icon: faHome, path: "/Home" },
    { label: "Profile", icon: faUser, path: "/Profile" },
    { label: "Fin Guru", icon: faRobot, path: "/FinanceAIPage" },
    { label: "knowledge Vault", icon: faFolderOpen, path: "/KnowledgePage" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">S</div>
        <div>
          <h2>Savings Saga</h2>
          <span>Your finance dashboard</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-navigation" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <button
            type="button"
            className="SideNavBarField"
            key={item.label}
            onClick={() => navigate(item.path)}
          >
            <FontAwesomeIcon icon={item.icon} className="icon" />
            <span className="text">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="SideNavBarField logout-sidebar-btn"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
          <span className="text">Logout</span>
        </button>
      </div>

      <button
        type="button"
        className="toggle-btn"
        onClick={handleToggle}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        title={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
      </button>
    </aside>
  );
};

export default SideNavBar;
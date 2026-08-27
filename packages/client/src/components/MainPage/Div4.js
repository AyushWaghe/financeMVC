import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMoneyCheckAlt,
  faChartLine,
  faShieldAlt,
  faHistory,
  faRobot
} from "@fortawesome/free-solid-svg-icons";

import "./Div4.css";

function Div4() {
  return (
    <div className="div4-section">
      <div>
        <h1 className="div4-header">Unique Features</h1>
      </div>

      <div className="div4-row">
        <div className="div4-feature">
          <div className="div4-icon-box">
            <FontAwesomeIcon icon={faBell} className="div4-feature-icon" />
          </div>

          <h1 className="div4-feature-title">Bill reminders</h1>

          <p className="div4-feature-text">
            Never Miss a Payment Again: Our Bill Reminder Feature Keeps Your
            Finances on Track
          </p>
        </div>

        <div className="div4-feature">
          <div className="div4-icon-box">
            <FontAwesomeIcon
              icon={faMoneyCheckAlt}
              className="div4-feature-icon"
            />
          </div>

          <h1 className="div4-feature-title">Budget Management</h1>

          <p className="div4-feature-text">
            Master Your Finances with Precision: Your Financial Tracker's
            Budget Management Tool
          </p>
        </div>
      </div>

      <div className="div4-row div4-single-row">
        <div className="div4-feature">
          <div className="div4-icon-box">
            <FontAwesomeIcon
              icon={faChartLine}
              className="div4-feature-icon"
            />
          </div>

          <h1 className="div4-feature-title">Investment tracking</h1>

          <p className="div4-feature-text">
            Watch Your Wealth Grow: Effortlessly Track Your Investments with
            Precision and Confidence!
          </p>
        </div>
        <div className="div4-feature">
    <div className="div4-icon-box">
      <FontAwesomeIcon
        icon={faRobot}
        className="div4-feature-icon"
      />
    </div>

    <h1 className="div4-feature-title">AI Financial Agent</h1>

    <p className="div4-feature-text">
      Your Personal Finance Assistant: Ask Questions, Analyze Your Spending,
      Get Smart Financial Insights, and Make Better Decisions with AI.
    </p>
  </div>
      </div>

      <div className="div4-row">
        <div className="div4-feature">
          <div className="div4-icon-box">
            <FontAwesomeIcon icon={faShieldAlt} className="div4-feature-icon" />
          </div>

          <h1 className="div4-feature-title">Data encryption</h1>

          <p className="div4-feature-text">
            Fortify Your Finances with Iron-Clad Security: Your Data, Encrypted
            and Protected!
          </p>
        </div>

        <div className="div4-feature">
          <div className="div4-icon-box">
            <FontAwesomeIcon icon={faHistory} className="div4-feature-icon" />
          </div>

          <h1 className="div4-feature-title">Transaction history</h1>

          <p className="div4-feature-text">
            Unlock Your Financial Past: Dive into Your Transaction History
          </p>
        </div>
      </div>
    </div>
  );
}

export default Div4;
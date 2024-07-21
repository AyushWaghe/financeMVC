import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoneyCheckAlt, faChartLine, faShieldAlt, faHistory } from '@fortawesome/free-solid-svg-icons';


function Div4() {
  return (
    <div className="mydiv4">
      <div>
        <h1 className="Header">Unique Features</h1>
      </div>

      <div className="Set">
        <div className="UniqueContent">
          <FontAwesomeIcon icon={faBell} size="3x" className="icon zoom" />
          <h1 className="Heads">Bill reminders</h1>
          <p className="HeadsContent">Never Miss a Payment Again: Our Bill Reminder Feature Keeps Your Finances on Track</p>
        </div>
        <div className="UniqueContent">
          <FontAwesomeIcon icon={faMoneyCheckAlt} size="3x" className="icon zoom" />
          <h1 className="Heads">Budget Management</h1>
          <p className="HeadsContent">Master Your Finances with Precision: Your Financial Tracker's Budget Management Tool</p>
        </div>
      </div>
      <div className="Set">
        <div className="UniqueContent InvestmentTracking">
          <FontAwesomeIcon icon={faChartLine} size="3x" className="icon zoom investmentTracking" />
          <h1 className="Heads">Investment tracking</h1>
          <p className="HeadsContent">Watch Your Wealth Grow: Effortlessly Track Your Investments with Precision and Confidence!</p>
        </div>
      </div>
      <div className="Set DataEnc">
        <div className="UniqueContent">
          <FontAwesomeIcon icon={faShieldAlt} size="3x" className="icon zoom" />
          <h1 className="Heads">Data encryption</h1>
          <p className="HeadsContent">"Fortify Your Finances with Iron-Clad Security: Your Data, Encrypted and Protected!"</p>
        </div>
        <div className="UniqueContent">
          <FontAwesomeIcon icon={faHistory} size="3x" className="icon zoom" />
          <h1 className="Heads">Transaction history</h1>
          <p className="HeadsContent">"Unlock Your Financial Past: Dive into Your Transaction History"</p>
        </div>
      </div>
    </div>
  );
}

export default Div4;

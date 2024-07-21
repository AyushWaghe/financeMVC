import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faListAlt, faHistory, faChartPie } from '@fortawesome/free-solid-svg-icons';
// import '../../assets/SideNavBar.css';

function Div2() {
  const descriptions = {
    secureData: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec nisi ac quam sollicitudin finibus.",
    trackBills: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec nisi ac quam sollicitudin finibus.",
    trackHistory: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec nisi ac quam sollicitudin finibus.",
    insightfulAnalytics: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec nisi ac quam sollicitudin finibus."
  };

  return (
    <div className="mydiv2">
      <div className="Set">
        <div className="Block">
          <div className="Description">Our financial tracker ensures the utmost security of your sensitive data. With advanced encryption techniques and robust security measures, your financial information remains protected at all times, giving you peace of mind as you manage your finances.</div>
          <FontAwesomeIcon icon={faLock} size="2x" />
          <p className="Ti">100% Secure Data</p>
        </div>
        <div className="Block">
          <div className="Description">
            Our financial tracker ensures the utmost security of your sensitive data. With advanced encryption techniques and robust security measures, your financial information remains protected at all times, giving you peace of mind as you manage your finances.
          </div>
          <FontAwesomeIcon icon={faListAlt} size="2x" />
          <p className="Ti">Track Bills</p>
        </div>
      </div>
      <div className="Set">
        <div className="Block">
          <div className="Description">Keep a detailed record of your bills and payments effortlessly. Our tracker allows you to monitor upcoming bills, track payment due dates, and categorize expenses, helping you stay organized and proactive in managing your financial obligations.</div>
          <FontAwesomeIcon icon={faHistory} size="2x" />
          <p className="Ti">Track History</p>
        </div>
        <div className="Block">
          <div className="Description">Gain valuable insights into your financial health with our analytics features.Identify trends, set goals, and track progress towards financial milestones, making smart financial decisions based on data-driven analysis.</div>
          <FontAwesomeIcon icon={faChartPie} size="2x" />
          <p className="Ti">Insightful Analytics</p>
        </div>
      </div>

    </div>
  );
}

export default Div2;

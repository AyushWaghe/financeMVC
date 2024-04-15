import React from "react";
import BillAlertField from "./BillAlertField";
import '../../assets/Card.css';


const BillAlert = ({ alertBills,onCrossClick }) => {

  const handleCrossClick = async(e) => {
    e.preventDefault();
    onCrossClick();
  }

  return (
    <div className="BillAlertCard">
      <div className="crossButtonDiv">
        <button className="crossButton" onClick={handleCrossClick}>
          X
        </button>
      </div>

      <div className="cardTitle">
        Upcoming Bills!
      </div>

      <div className="cardContent">
        <BillAlertField 
        bills={alertBills}
        />
      </div>
    </div>
  );
};

export default BillAlert;

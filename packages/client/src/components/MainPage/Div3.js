import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faLightbulb, faChartBar, faMoneyBill, faHome } from '@fortawesome/free-solid-svg-icons';
import moneyTrack from "../../assets/images/moneyTrack.png";
import dreams from "../../assets/images/dreams.png";
import visualise from "../../assets/images/visualise.png";
import wisdom from "../../assets/images/wisdom.PNG";

function Div3() {
  return (
    <div className="mydiv3">
      <div className="ImageLeftContentRight">
        <div className="ContentRight">
          <h1 className="ContentHeading">Track your money!</h1>
          <p className="ContentText">It takes seconds to record daily transactions. Put them into clear and visualized categories such as Expense: Food, Shopping or Income: Salary, Gift.</p>
        </div>
        <div className="Image">
          <img src={moneyTrack} alt="Track Money" className="zoomEffect moneyTrack"  />
        </div>
      </div>
      <div className="ImageRightContentLeft">
        <div className="Image">
          <img src={wisdom} alt="Empower Wisdom" className="zoomEffect wisdom" />
        </div>
        <div className="ContentLeft">
          <h1 className="ContentHeading">Empower Your Financial Wisdom!</h1>
          <p className="ContentText">Stay in the know with our treasure trove of educational resources. Our financial tracker not only crunches numbers but also serves as your financial mentor.</p>
        </div>
      </div>
      <div className="ImageLeftContentRight">
        <div className="ContentRight">
          <h1 className="ContentHeading">Visualize things!</h1>
          <p className="ContentText">Transform your finances into a vibrant visual story. Our financial tracker doesn't just crunch numbers; it paints your financial journey in vivid, easy-to-understand graphs and charts.</p>
        </div>
        <div className="Image">
          <img src={visualise} alt="Visualize Things" className="zoomEffect visualise" />
        </div>
      </div>
      <div className="ImageRightContentLeft">
        <div className="Image">
          <img src={dreams} alt="Dreams and Goals" className="zoomEffect dreams"  />
        </div>
        <div className="ContentLeft">
          <h1 className="ContentHeading">Your Dreams, Your Goals, Your Path</h1>
          <p className="ContentText">Dream big, save smart. Our financial tracker puts your ambitions at the forefront. Define your financial aspirations, from that dream vacation to conquering those loans.</p>
        </div>
      </div>
    </div>
  );
}

export default Div3;

import React from "react";
import {useNavigate} from 'react-router-dom'
import img1 from "./Capture.jpg";

function Div1() {

    const navigate=useNavigate();

    const para = {
        display: "inline"
    }
    const buttonStyle = {
        fontFamily: 'Nunito, sans-serif', // Replace 'YourChosenFont' with the desired font
    };

    return (
        <div className="mydiv">
            <div className="HeadingDiv">
                <div className="TitleHeader">
                    <div className="paragraphStyle">
                        <p style={para}>Savings</p> <br />
                    </div>
                    <div className="paragraphStyle2">
                        <p style={para}>Saga.</p>
                    </div>
                </div>

                {/* Button div */}
                <div className="ButtonDiv">
                {/* Login button */}
                <button type="button" className="LoginButton" style={buttonStyle} onClick={()=> navigate("/login")}>Login </button>

                {/* Sign button */}
                <button type="button" className="SignButton" style={buttonStyle}   onClick={()=> navigate("/Sign")}>Sign up</button>
                </div>
            </div>
            <div className="TitleImage">
                <img src={img1} alt="Title" style={{ width: "600px", height: "500px" }}  />
            </div>
        </div>
           
           );   
} 
            
export default Div1;  
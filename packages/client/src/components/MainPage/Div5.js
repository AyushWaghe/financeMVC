import React from "react";
import contact from "../../assets/images/contact.PNG";

function Div5() {
    return (
        <div className="mydiv5">
            <div className="DivHeader">
                CONTACT US
            </div>

            <div className="infoContainer" style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <img src={contact} alt="Contact" />
                <div className="inputForm">
                    <div className="Heading">EMAIL:</div>
                    <input type="text" className="input" />

                    <div className="Heading">PHONE NUMBER:</div>
                    <input type="text" className="input" />

                    <div className="Heading">MESSAGE:</div>
                    <input type="text" className="input" style={{"height":"20vh"}} />
                </div>
            </div>
        </div>
    );
}

export default Div5;

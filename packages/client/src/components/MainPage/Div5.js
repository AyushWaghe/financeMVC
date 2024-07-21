import React, { useState } from "react";
import contact from "../../assets/images/contact.PNG";

function Div5() {
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email =="" || phoneNumber == "" || message == "") {
            alert("please enter all the details");
        } else {
            setEmail('');
            setPhoneNumber('');
            setMessage('');
            alert("Form submitted successfully");
        }
    };

    return (
        <div className="mydiv5">
            <div className="DivHeader">
                CONTACT US
            </div>

            <div className="infoContainer">
                <img src={contact} alt="Contact" className="Contact" />
                <form className="inputForm" onSubmit={handleSubmit}>
                    <div className="Heading">EMAIL:</div>
                    <input
                        type="text"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="Heading">PHONE NUMBER:</div>
                    <input
                        type="text"
                        className="input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <div className="Heading">MESSAGE:</div>
                    <input
                        type="text"
                        className="input"
                        style={{ "height": "20vh" }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button type="submit" className="ContactSubmit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Div5;

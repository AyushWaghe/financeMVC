import React, { useEffect, useState } from "react";
import BillField from '../BillReminders/BillField.js';
import axios from "axios";
import { useSelector } from 'react-redux';
import SideNavBar from '../SideNavBar/SideNavBar';

const PastBills = () => {
    const [navBarisToggle, setNavBarisToggle] = useState(false);
    const [bills, setBills] = useState([]);

    const user = useSelector((state) => state.user);
    const userName = user.user.userName;

    const setNavBarTogggle = () => {
        setNavBarisToggle(!navBarisToggle);
    }

    const fetchInActiveBills = async () => {
        try {
            const response = await axios.get(`https://financemvc.onrender.com/BillReminders/fetchBills?userName=${userName}&activeStatus=${0}`);
            setBills(response.data.activeBills);
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        fetchInActiveBills();
    }, []);

    return (
        <div style={{ "padding": "0px,",display:"flex","flexDirection":"row" }}>
            <div className="navBar" style={{ "marginTop": "-0.5%" }}>
                <SideNavBar
                    isToggle={setNavBarTogggle}
                />
            </div>

            {navBarisToggle && <div className="Model"></div>}

            <div style={{"marginTop":"1.5%","width":"100%"}}>
                <BillField
                    bills={bills}
                    onDelete={fetchInActiveBills}
                />
            </div>

        </div>
    )
}

export default PastBills;

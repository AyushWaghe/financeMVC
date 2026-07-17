import React, { useEffect, useState } from "react";
import BillField from '../BillReminders/BillField.js';
import axios from "axios";
import { useSelector } from 'react-redux';
import SideNavBar from '../SideNavBar/SideNavBar';
import BillInstanceField from "../BillReminders/BillInstanceField.js";
import api from "../../api/AxiosConfig.js";

const PastBills = () => {
    const [navBarisToggle, setNavBarisToggle] = useState(false);
    const [bills, setBills] = useState([]);

    const user = useSelector((state) => state.user);
    const userId= user.user.userId;

    const setNavBarTogggle = () => {
        setNavBarisToggle(!navBarisToggle);
    }

    const fetchPaidBills = async () => {
        try {
            const response = await api.get(`/bill-instance/status/user/${userId}`,{
                params:{
                    status:"PAID"
                }
            },{
                withCredentials:true //This tells Axios to send and receive cookies. 
              });
            setBills(response.data.data);
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        fetchPaidBills();
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
                <BillInstanceField
                    bills={bills}
                    onDelete={fetchPaidBills}
                    sectionTitle={"PAID BILLS"}
                    status={"PAID"}
                />
            </div>

        </div>
    )
}

export default PastBills;

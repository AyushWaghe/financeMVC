import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import SideNavBar from '../SideNavBar/SideNavBar';
import BillInstanceField from "../BillReminders/BillInstanceField.js";
import {api} from "../../api/AxiosConfig.js";
import PageSizeDropDown from "../Widgets/PageSizeDropDown.js";
import PaginationControls from "../Widgets/PaginationControls.js";

const PastBills = () => {
    const [navBarisToggle, setNavBarisToggle] = useState(false);
    const [bills, setBills] = useState([]);

    const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

    const user = useSelector((state) => state.user);
    const userId= user.user.userId;

    const setNavBarTogggle = () => {
        setNavBarisToggle(!navBarisToggle);
    }

    const fetchPaidBills = async () => {
        try {
            const response = await api.get(`/bill-instance/status/user/${userId}`,{
                params:{
                    status:"PAID",
                    page: page,
                    size: pageSize
                }
            },{
                withCredentials:true //This tells Axios to send and receive cookies. 
              });
            setBills(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        fetchPaidBills();
    }, []);

    useEffect(() => {
        fetchPaidBills();
      }, [page, pageSize]);

    return (
        <div style={{ "padding": "0px,",display:"flex","flexDirection":"row" }}>
            <div className="navBar" style={{ "marginTop": "-0.5%" }}>
                <SideNavBar
                    isToggle={setNavBarTogggle}
                />
            </div>

            {navBarisToggle && <div className="Model"></div>}

            <div style={{"marginTop":"1.5%","width":"100%"}}>
            <PageSizeDropDown
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPage={setPage} />
                <BillInstanceField
                    bills={bills}
                    onDelete={fetchPaidBills}
                    sectionTitle={"PAID BILLS"}
                    status={"PAID"}
                />
                <PaginationControls
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
            </div>

        </div>
    )
}

export default PastBills;

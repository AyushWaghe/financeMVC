import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import fetchTransactions from '../Functions/fetchTransaction.js';
import '../../assets/GraphStyles.css';
import Chart from 'chart.js/auto';
import SideNavBar from '../SideNavBar/SideNavBar';

const Graphs = () => {
    const [navBarisToggle, setNavBarisToggle] = useState(false);
    const user = useSelector((state) => state.user);
    const userName = user.user.userName;
    const [transactionData, setTransactionData] = useState([]);

    const setNavBarTogggle = () => {
        setNavBarisToggle(!navBarisToggle);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTransactions(userName);
                setTransactionData(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, [userName]);

    // Ensure transactionData is not undefined before processing
    if (!transactionData || transactionData.length === 0) {
        return (
            <div className="GraphContainer">
                <div className="navBar">
                    <SideNavBar
                        isToggle={setNavBarTogggle}
                    />
                </div>

                {navBarisToggle && <div className="Model"></div>}
                <div className="GraphMaster">
                    <div className="ColDiv">
                        <h1>Analytics</h1>
                    </div>
                    <div className="ColDiv">
                        <div className="NoDataMessage">No transaction data available</div>
                    </div>
                </div>
            </div>
        );
    }

    // Aggregate total transactions for each month
    const monthlyTotals = {};
    transactionData.forEach(transaction => {
        const month = transaction.month;
        const total = transaction.total; 
        if (monthlyTotals[month]) {
            monthlyTotals[month] += total;
        } else {
            monthlyTotals[month] = total;
        }
    });


    const barChartData = {
        labels: Object.keys(monthlyTotals), // Months
        datasets: [
            {
                label: 'Total Amount',
                data: Object.values(monthlyTotals), // Total amount for each month
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

  
    const pieChartData = {
        labels: Object.keys(monthlyTotals), // Months
        datasets: [
            {
                label: 'Monthly Total Transactions',
                data: Object.values(monthlyTotals), // Total amount for each month
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="GraphContainer">
            <div className="navBar">
                <SideNavBar
                    isToggle={setNavBarTogggle}
                />
            </div>

            {navBarisToggle && <div className="Model"></div>}
            <div className="GraphMaster">
                <div className="ColDiv">
                    <h1>Analytics</h1>
                </div>
                <div className="ColDiv">
                    <div className="BarGraph">
                        <span className="GraphTitle">Total monthly expenditures</span>
                        <Bar data={barChartData} />
                    </div>
                    <div className="PieGraph">
                        <span className="GraphTitle">Total monthly expenditures</span>
                        <Pie data={pieChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Graphs;

import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import axios from 'axios';
import SideNavBar from '../SideNavBar/SideNavBar';
import './GraphStyles.css';
import {api} from '../../api/AxiosConfig';

const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const chartColors = {
    savings: '#2f80ed',
    needs: '#27ae60',
    wants: '#f2994a',
    income: '#16a085',
    expense: '#eb5757',
    grid: 'rgba(28, 39, 64, 0.08)',
    text: '#334155'
};

const categoryColors = [
    '#2f80ed',
    '#27ae60',
    '#f2994a',
    '#eb5757',
    '#9b51e0',
    '#00a8a8',
    '#f2c94c',
    '#6fcf97',
    '#56ccf2',
    '#bb6bd9'
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const buildYearOptions = () => {
    return Array.from({ length: 7 }, (_, index) => currentYear - index);
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(Number(value || 0));
};

const getMonthLabel = (month) => {
    return monthNames[Number(month) - 1] || `Month ${month}`;
};

const getTotalAmount = (items, key) => {
    return items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
};

const commonBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                color: chartColors.text,
                padding: 18,
                font: {
                    size: 12,
                    weight: '600'
                }
            }
        },
        tooltip: {
            backgroundColor: '#111827',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
                label: (context) => {
                    return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: chartColors.text,
                font: {
                    weight: '600'
                }
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: chartColors.grid
            },
            ticks: {
                color: chartColors.text,
                callback: (value) => formatCurrency(value)
            }
        }
    }
};

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                color: chartColors.text,
                padding: 16,
                font: {
                    size: 12,
                    weight: '600'
                }
            }
        },
        tooltip: {
            backgroundColor: '#111827',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
                label: (context) => {
                    return `${context.label}: ${formatCurrency(context.raw)}`;
                }
            }
        }
    }
};

const EmptyState = ({ message }) => {
    return (
        <div className="analytics-empty-state">
            <span>{message}</span>
        </div>
    );
};

const PanelHeader = ({
    title,
    subtitle,
    selectedYear,
    onYearChange,
    selectedMonth,
    onMonthChange,
    showMonthSelector = false
}) => {
    return (
        <div className="analytics-panel-header">
            <div>
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            <div className="analytics-filters">
                {showMonthSelector && (
                    <select
                        value={selectedMonth}
                        onChange={(event) => onMonthChange(Number(event.target.value))}
                        className="analytics-select"
                    >
                        {fullMonthNames.map((month, index) => (
                            <option key={month} value={index + 1}>
                                {month}
                            </option>
                        ))}
                    </select>
                )}

                <select
                    value={selectedYear}
                    onChange={(event) => onYearChange(Number(event.target.value))}
                    className="analytics-select"
                >
                    {buildYearOptions().map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const Graphs = () => {
    const [navBarisToggle, setNavBarisToggle] = useState(false);

    const user = useSelector((state) => state.user);
    const userId = user.user.userId;

    const [monthlySavings, setMonthlySavings] = useState([]);
    const [monthlyNeedsWants, setMonthlyNeedsWants] = useState([]);
    const [monthlyIncomeExpense, setMonthlyIncomeExpense] = useState([]);
    const [monthlyCategory, setMonthlyCategory] = useState([]);

    const [savingsYear, setSavingsYear] = useState(currentYear);
    const [needsWantsYear, setNeedsWantsYear] = useState(currentYear);
    const [incomeExpenseYear, setIncomeExpenseYear] = useState(currentYear);
    const [categoryYear, setCategoryYear] = useState(currentYear);
    const [categoryMonth, setCategoryMonth] = useState(currentMonth);

    const [loadingState, setLoadingState] = useState({
        savings: false,
        needsWants: false,
        incomeExpense: false,
        category: false
    });

    const [errorState, setErrorState] = useState({
        savings: '',
        needsWants: '',
        incomeExpense: '',
        category: ''
    });

    const setNavBarTogggle = () => {
        setNavBarisToggle(!navBarisToggle);
    };

    useEffect(() => {
        const fetchMonthlySavings = async () => {
            setLoadingState((prev) => ({ ...prev, savings: true }));
            setErrorState((prev) => ({ ...prev, savings: '' }));

            try {
                const response = await api.get(
                    `/analytics/monthly-savings/user/${userId}`,
                    {
                        params: {
                            year: savingsYear
                        }
                    },{
                        withCredentials:true //This tells Axios to send and receive cookies. 
                      }
                );

                setMonthlySavings(response.data.data || []);
            } catch (error) {
                setErrorState((prev) => ({
                    ...prev,
                    savings: error.message || 'Unable to load monthly savings'
                }));
            } finally {
                setLoadingState((prev) => ({ ...prev, savings: false }));
            }
        };

        if (userId) {
            fetchMonthlySavings();
        }
    }, [userId, savingsYear]);

    useEffect(() => {
        const fetchMonthlyNeedsWants = async () => {
            setLoadingState((prev) => ({ ...prev, needsWants: true }));
            setErrorState((prev) => ({ ...prev, needsWants: '' }));

            try {
                const response = await api.get(
                    `/analytics/monthly-needs-wants/user/${userId}`,
                    {
                        params: {
                            year: needsWantsYear
                        }
                    },{
                        withCredentials:true //This tells Axios to send and receive cookies. 
                      }
                );

                setMonthlyNeedsWants(response.data.data || []);
            } catch (error) {
                setErrorState((prev) => ({
                    ...prev,
                    needsWants: error.message || 'Unable to load needs and wants'
                }));
            } finally {
                setLoadingState((prev) => ({ ...prev, needsWants: false }));
            }
        };

        if (userId) {
            fetchMonthlyNeedsWants();
        }
    }, [userId, needsWantsYear]);

    useEffect(() => {
        const fetchMonthlyIncomeExpense = async () => {
            setLoadingState((prev) => ({ ...prev, incomeExpense: true }));
            setErrorState((prev) => ({ ...prev, incomeExpense: '' }));

            try {
                const response = await api.get(
                    `/analytics/income-vs-expense/user/${userId}`,
                    {
                        params: {
                            year: incomeExpenseYear
                        }
                    },{
                        withCredentials:true //This tells Axios to send and receive cookies. 
                      }
                );

                setMonthlyIncomeExpense(response.data.data || []);
            } catch (error) {
                setErrorState((prev) => ({
                    ...prev,
                    incomeExpense: error.message || 'Unable to load income and expense'
                }));
            } finally {
                setLoadingState((prev) => ({ ...prev, incomeExpense: false }));
            }
        };

        if (userId) {
            fetchMonthlyIncomeExpense();
        }
    }, [userId, incomeExpenseYear]);

    useEffect(() => {
        const fetchMonthlyCategory = async () => {
            setLoadingState((prev) => ({ ...prev, category: true }));
            setErrorState((prev) => ({ ...prev, category: '' }));

            try {
                const response = await api.get(
                    `/analytics/monthly-category/user/${userId}`,
                    {
                        params: {
                            month: categoryMonth,
                            year: categoryYear
                        }
                    },{
                        withCredentials:true //This tells Axios to send and receive cookies. 
                      }
                );

                setMonthlyCategory(response.data.data || []);
            } catch (error) {
                setErrorState((prev) => ({
                    ...prev,
                    category: error.message || 'Unable to load category data'
                }));
            } finally {
                setLoadingState((prev) => ({ ...prev, category: false }));
            }
        };

        if (userId) {
            fetchMonthlyCategory();
        }
    }, [userId, categoryMonth, categoryYear]);

    const savingsChartData = useMemo(() => {
        return {
            labels: monthlySavings.map((item) => getMonthLabel(item.month)),
            datasets: [
                {
                    label: 'Monthly Savings',
                    data: monthlySavings.map((item) => Number(item.spendings || item.savings || 0)),
                    backgroundColor: 'rgba(47, 128, 237, 0.75)',
                    borderColor: chartColors.savings,
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 46
                }
            ]
        };
    }, [monthlySavings]);

    const needsWantsChartData = useMemo(() => {
        return {
            labels: monthlyNeedsWants.map((item) => getMonthLabel(item.month)),
            datasets: [
                {
                    label: 'Needs',
                    data: monthlyNeedsWants.map((item) => Number(item.needs || 0)),
                    backgroundColor: 'rgba(39, 174, 96, 0.75)',
                    borderColor: chartColors.needs,
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 42
                },
                {
                    label: 'Wants',
                    data: monthlyNeedsWants.map((item) => Number(item.wants || 0)),
                    backgroundColor: 'rgba(242, 153, 74, 0.75)',
                    borderColor: chartColors.wants,
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 42
                }
            ]
        };
    }, [monthlyNeedsWants]);

    const incomeExpenseChartData = useMemo(() => {
        return {
            labels: monthlyIncomeExpense.map((item) => getMonthLabel(item.month)),
            datasets: [
                {
                    label: 'Income',
                    data: monthlyIncomeExpense.map((item) => Number(item.income || 0)),
                    backgroundColor: 'rgba(22, 160, 133, 0.75)',
                    borderColor: chartColors.income,
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 42
                },
                {
                    label: 'Expense',
                    data: monthlyIncomeExpense.map((item) => Number(item.expense || 0)),
                    backgroundColor: 'rgba(235, 87, 87, 0.75)',
                    borderColor: chartColors.expense,
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 42
                }
            ]
        };
    }, [monthlyIncomeExpense]);

    const categoryChartData = useMemo(() => {
        return {
            labels: monthlyCategory.map((item) => item.category),
            datasets: [
                {
                    label: 'Category Spend',
                    data: monthlyCategory.map((item) => Number(item.amount || 0)),
                    backgroundColor: categoryColors,
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 12
                }
            ]
        };
    }, [monthlyCategory]);

    const totalSavings = getTotalAmount(monthlySavings, 'spendings');
    const totalNeeds = getTotalAmount(monthlyNeedsWants, 'needs');
    const totalWants = getTotalAmount(monthlyNeedsWants, 'wants');
    const totalIncome = getTotalAmount(monthlyIncomeExpense, 'income');
    const totalExpense = getTotalAmount(monthlyIncomeExpense, 'expense');
    const totalCategoryAmount = getTotalAmount(monthlyCategory, 'amount');

    return (
        <div className="GraphContainer">
            <div className="navBar">
                <SideNavBar isToggle={setNavBarTogggle} />
            </div>

            {navBarisToggle && <div className="Model"></div>}

            <main className="GraphMaster">
                <section className="analytics-hero">
                    <div>
                        <span className="analytics-eyebrow">Finance Overview</span>
                        <h1>Analytics</h1>
                        <p>
                            Track monthly cash flow, spending behavior, and category-wise expense patterns.
                        </p>
                    </div>
                </section>

                <section className="analytics-summary-grid">
                    <div className="analytics-summary-card">
                        <span>Total Savings</span>
                        <strong>{formatCurrency(totalSavings)}</strong>
                    </div>

                    <div className="analytics-summary-card">
                        <span>Needs vs Wants</span>
                        <strong>{formatCurrency(totalNeeds)} / {formatCurrency(totalWants)}</strong>
                    </div>

                    <div className="analytics-summary-card">
                        <span>Income Balance</span>
                        <strong>{formatCurrency(totalIncome - totalExpense)}</strong>
                    </div>

                    <div className="analytics-summary-card">
                        <span>Selected Category Total</span>
                        <strong>{formatCurrency(totalCategoryAmount)}</strong>
                    </div>
                </section>

                <section className="analytics-grid">
                    <article className="analytics-panel">
                        <PanelHeader
                            title="Monthly Savings"
                            subtitle="Savings trend across selected year"
                            selectedYear={savingsYear}
                            onYearChange={setSavingsYear}
                        />

                        <div className="analytics-chart-area">
                            {loadingState.savings && <EmptyState message="Loading savings data..." />}
                            {errorState.savings && <EmptyState message={errorState.savings} />}
                            {!loadingState.savings && !errorState.savings && monthlySavings.length === 0 && (
                                <EmptyState message="No savings data found" />
                            )}
                            {!loadingState.savings && !errorState.savings && monthlySavings.length > 0 && (
                                <Bar data={savingsChartData} options={commonBarOptions} />
                            )}
                        </div>
                    </article>

                    <article className="analytics-panel">
                        <PanelHeader
                            title="Monthly Needs & Wants"
                            subtitle="Compare essential and lifestyle spending"
                            selectedYear={needsWantsYear}
                            onYearChange={setNeedsWantsYear}
                        />

                        <div className="analytics-chart-area">
                            {loadingState.needsWants && <EmptyState message="Loading needs and wants..." />}
                            {errorState.needsWants && <EmptyState message={errorState.needsWants} />}
                            {!loadingState.needsWants && !errorState.needsWants && monthlyNeedsWants.length === 0 && (
                                <EmptyState message="No needs and wants data found" />
                            )}
                            {!loadingState.needsWants && !errorState.needsWants && monthlyNeedsWants.length > 0 && (
                                <Bar data={needsWantsChartData} options={commonBarOptions} />
                            )}
                        </div>
                    </article>

                    <article className="analytics-panel">
                        <PanelHeader
                            title="Monthly Income vs Expense"
                            subtitle="Understand your inflow and outflow"
                            selectedYear={incomeExpenseYear}
                            onYearChange={setIncomeExpenseYear}
                        />

                        <div className="analytics-chart-area">
                            {loadingState.incomeExpense && <EmptyState message="Loading income and expense..." />}
                            {errorState.incomeExpense && <EmptyState message={errorState.incomeExpense} />}
                            {!loadingState.incomeExpense && !errorState.incomeExpense && monthlyIncomeExpense.length === 0 && (
                                <EmptyState message="No income and expense data found" />
                            )}
                            {!loadingState.incomeExpense && !errorState.incomeExpense && monthlyIncomeExpense.length > 0 && (
                                <Bar data={incomeExpenseChartData} options={commonBarOptions} />
                            )}
                        </div>
                    </article>

                    <article className="analytics-panel">
                        <PanelHeader
                            title="Category Wise Expenses"
                            subtitle="Expense split for selected month"
                            selectedYear={categoryYear}
                            onYearChange={setCategoryYear}
                            selectedMonth={categoryMonth}
                            onMonthChange={setCategoryMonth}
                            showMonthSelector
                        />

                        <div className="analytics-chart-area pie-chart-area">
                            {loadingState.category && <EmptyState message="Loading category data..." />}
                            {errorState.category && <EmptyState message={errorState.category} />}
                            {!loadingState.category && !errorState.category && monthlyCategory.length === 0 && (
                                <EmptyState message="No category data found" />
                            )}
                            {!loadingState.category && !errorState.category && monthlyCategory.length > 0 && (
                                <Pie data={categoryChartData} options={pieOptions} />
                            )}
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
};

export default Graphs;
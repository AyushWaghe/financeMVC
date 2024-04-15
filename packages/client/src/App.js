import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDiv from './components/MainPage/MainDiv.js';
import Login from './components/Registering/Login.js';
import SignUp from './components/Registering/SignUp.js';
import Home from './components/HomePage/Home.js';
import Transact from './components/TransactionHistory/Transact';
import Main from './components/APINews/Main';
import Graphs from './components/Graphs/Graphs.js';
import BillReminder from './components/BillReminders/BillReminder.js';
import PastBills from './components/PastBills/PastBills.js';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* The Login component is rendered when the /login path is matched */}
          <Route path="/" element={<MainDiv />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Sign" element={<SignUp />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Transact" element={<Transact />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/Graphs" element={<Graphs />} />
          <Route path="/BillReminder" element={<BillReminder />} />
          <Route path="/PastBills" element={<PastBills />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

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
import Profile from './components/UserProfile/Profile.js';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';
import FinanceAIPage from './components/FinanceAI/FinanceAIPage.js';
import KnowledgePage from './components/KnowledgePage/KnowledgePage.js';

function App() {
  return (
    <Router>
      <div className="App">


        <Routes>
          <Route path="/" element={<MainDiv />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Sign" element={<SignUp />} />

          <Route element={<ProtectedRoute />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/Transact" element={<Transact />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/Graphs" element={<Graphs />} />
          <Route path="/BillReminder" element={<BillReminder />} />
          <Route path="/PastBills" element={<PastBills />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/FinanceAIPage" element={<FinanceAIPage />} />
          <Route path="/KnowledgePage" element={<KnowledgePage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

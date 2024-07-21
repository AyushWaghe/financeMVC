import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, setBillAlertStatus } from '../../features/userSlice';

function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 

    console.log("Logging in with:", { userName, userPassword });

    dispatch(login({
      userName: userName,
      userPassword: userPassword
    }));

    dispatch(setBillAlertStatus({
      alertStatus: true,
    }));

    try {
      console.log("Trying to login");
      const response = await axios.post('https://financemvc.onrender.com/register/userLogin', {
        userName,
        userPassword,
      });
      if (response.data.success) {
        console.log("Done"); 
        navigate("/Home");
      } else {
        setError('Invalid credentials'); 
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form>
        <label htmlFor="username" className="login-label">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="userName"
          className="login-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label htmlFor="password" className="login-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="userPassword"
          className="login-input"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />

        <button type="submit" className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in, please wait..." : "Login"}
        </button>
        {error && <div className="error-message">{error}</div>} 
      </form>
    </div>
  );
}

export default Login;

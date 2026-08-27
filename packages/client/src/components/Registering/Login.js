import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, setBillAlertStatus } from '../../features/userSlice';
import {api} from '../../api/AxiosConfig';
import { setCategories } from '../../features/categorySlice';
import fetchCategories from '../Functions/fetchCategories';

function Login() {
  const navigate = useNavigate();
  const [useremail, setuseremail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 

    try {
      const response = await api.post('/auth/signin', {
        useremail,
        password,
      },{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });
      console.log("login repsonse",response)
      if (response.data.success) {
        
        dispatch(login({
          userId:response.data.userId,
        }));
    
        dispatch(setBillAlertStatus({
          alertStatus: true,
        }));

        navigate("/Home");

        const categories=await fetchCategories(response.data.userId);
      
        dispatch(setCategories({
          categories
        }))
        
      } else {
        setError('Invalid credentials'); 
      }
    } catch (err) {
      if(err?.response?.status==401){
        setError('Invalid username/password'); 
      }else{
        setError('An error occurred'); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form>
        <label htmlFor="useremail" className="login-label">
          useremail:
        </label>
        <input
          type="text"
          id="useremail"
          name="useremail"
          className="login-input"
          value={useremail}
          onChange={(e) => setuseremail(e.target.value)}
        />

        <label htmlFor="password" className="login-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="login-input"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
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

import {useNavigate} from 'react-router-dom'
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signup,setBillAlertStatus } from '../../features/userSlice';
  function SignUp() {
    const navigate = useNavigate();
    const [userName,setUserName]=useState('');
    const [userPassword,setUserPassword]=useState('');

    const dispatch = useDispatch();

    const handleSignUp =async (e) =>{
      e.preventDefault();
      dispatch(signup({
        userName:userName,
        userPassword:userPassword
      }));

      dispatch(setBillAlertStatus({
        alertStatus:true,
      }));

      try{
        const response = await axios.post('https://financemvc.onrender.com/register/userSignUp',{
          userName,
          userPassword,
        });
        if (response.data.success) {
          console.log("Done"); // Login successful
          navigate("/Home");
        } else {
          console.log("none"); // Login failed
        }
      } catch(err){
        console.log(err);
      }
    };

    return (
      <div className="login-container">
        <h2 className="login-heading">Sign Up</h2>
        <form >
          <label htmlFor="username" className="login-label">
            Username:
          </label>
          <input type="text" 
          id="username" 
          name="userName" 
          className="login-input" 
          value={userName}
          onChange={(e)=> setUserName(e.target.value)}
          />

          <label htmlFor="password" className="login-label">
            Password:
          </label>
          <input type="password" 
          id="password" 
          name="userPassword" 
          className="login-input" 
          value={userPassword}
          onChange={(e)=> setUserPassword(e.target.value)}
          />

          <button type="submit" className="login-button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }

  export default SignUp;

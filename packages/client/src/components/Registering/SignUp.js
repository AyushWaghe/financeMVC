import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup, setBillAlertStatus } from '../../features/userSlice';
import {api} from '../../api/AxiosConfig';
import fetchCategories from '../Functions/fetchCategories';
import { setCategories } from '../../features/categorySlice';

function SignUp() {
  const navigate = useNavigate();
  const [useremail, setuseremail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); 



    try {
      const response = await api.post('/auth/signup', {
        useremail:useremail,
        password:password,
      },{
        withCredentials:true //This tells Axios to send and receive cookies. 
      });


      if (response.data.success) { // Login successful
        dispatch(signup({
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
        console.log("none"); // Login failed
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Sign Up</h2>
      <form>
        <label htmlFor="useremail" className="login-label">
          useremail:
        </label>
        <input
          type="email"
          id="useremail"
          name="useremail"
          className="login-input"
          value={useremail}
          onChange={(e) => setuseremail(e.target.value)}
          placeholder="Enter your email"
          required
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
          required
        />

        <button type="submit" className="login-button" onClick={handleSignUp} disabled={loading}>
          {loading ? "Signing up, please wait..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;

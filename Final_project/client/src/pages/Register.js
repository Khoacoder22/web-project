import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  const handleFinish = (event) => {
    event.preventDefault();
    const values = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    
    try {
      register(values);
      if (location.state?.from === 'cart') {
        navigate('/shope');
      } else {
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Error during registration');
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', padding: '20px', marginLeft: '50px', color: 'white' }}>Sign Up</h1>
      <div className="form-box">
        <div className="register-container" id="register">
          <form className='top' onSubmit={handleFinish}>
            <div className="input-box">
              <input type="text" name="username" className="input-field" placeholder='Name' required />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input type="password" name="password" className="input-field" placeholder='Password' required />
              <i className="bx bx-lock"></i>
            </div>
            <div className="input-box">
              <input type="password" name="verifyPassword" className="input-field" placeholder='Verify Password' required />
              <i className="bx bx-lock"></i>
            </div>
            <div className="input-box">
              <input type="email" name="email" className="input-field" placeholder='Email' required />
              <i className="bx bx-envelope"></i>
            </div>
            <br />
            <button className="button" type="submit">Register</button>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      </div>
    </>
  );
};

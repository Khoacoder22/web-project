import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './Register.css';  

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    const isSuccess = login({ username, password });
    if (isSuccess) {
      navigate('/');
    } else {
      toast.error('Invalid user or password', { 
        position: "top-right", 
        autoClose: 3000, 
      });
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', padding: '20px', marginLeft: '50px', color: 'white' }}>Login</h1>
      <div className="form-box">
        <div className="register-container" id="register">
          <form className='top' onSubmit={handleLogin}>
            <div className="input-box">
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="bx bx-lock"></i>
            </div>
            <br />
            <button className="button" type="submit">Login</button>
          </form>
        </div>
      </div>
      <ToastContainer /> {/* Đảm bảo ToastContainer được thêm vào */}
    </>
  );
};

export default Login;

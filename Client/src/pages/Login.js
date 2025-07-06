import React from 'react';
import { FaGoogle } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import '../styles/Login.css'; // make sure this file exists

const API = process.env.REACT_APP_API_URL;

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API}/api/auth/google/login`;
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1><FaFilePen style={{marginRight:'0.5em'}}/>Task Manager</h1>
        <p>Login to manage your tasks smartly.</p>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <FaGoogle />
        </button>
      </div>
    </div>
  );
};

export default Login;

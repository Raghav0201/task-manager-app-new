import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Check if already logged in
    const alreadyLoggedIn = localStorage.getItem("token");
    if (alreadyLoggedIn) {
      navigate("/dashboard");
      return;
    }

    // ✅ Check for token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      navigate("/dashboard");
    } else {
      // ❌ Only show alert if nothing is in storage either
      alert("Token missing. Login failed.");
    }
  }, [navigate]);

  return <p>Logging in with Google, please wait...</p>;
};

export default AuthCallback;

import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login attempt initiated");
    console.log("Email:", email);
    console.log("Password:", password); // Be cautious with logging sensitive info (e.g., password) in production!

    try {
      console.log("Sending login request to backend...");
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Received response from backend:", response);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Store the JWT token in localStorage
        console.log("Login successful. Storing JWT token in localStorage...");
        localStorage.setItem("token", data.token);

        alert("Login successful!");
        console.log("Redirecting to /home page");
        navigate('/home');  // Redirect to home page
      } else {
        console.log("Login failed:", data.message || "Unknown error");
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error during login request:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back 👋</h2>
        <p>Login to explore tasty recipes</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

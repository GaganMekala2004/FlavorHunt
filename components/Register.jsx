import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Registration attempt initiated");
    console.log("Email:", email);
    console.log("Password:", password); // Caution with logging sensitive info like passwords in production!

    if (password !== confirmPassword) {
      alert("Passwords don't match. Please try again.");
      console.log("Passwords do not match");
      return;
    }

    try {
      console.log("Sending registration request to backend...");
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Received response from registration API:", response);
      const data = await response.json();
      console.log("Registration response data:", data);

      if (response.ok) {
        console.log("Registration successful. Proceeding with login...");

        // After successful registration, automatically log in the user and store the JWT token
        const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        console.log("Received response from login API:", loginResponse);
        const loginData = await loginResponse.json();
        console.log("Login response data:", loginData);

        if (loginResponse.ok) {
          // Store JWT token
          console.log("Login successful. Storing JWT token in localStorage...");
          localStorage.setItem("token", loginData.token);

          alert("Registration and Login successful!");
          console.log("Redirecting to /home page");
          navigate('/home'); // Redirect to home page after login
        } else {
          console.log("Login failed:", loginData.message || "Unknown error");
          alert(loginData.message || "Login failed");
        }
      } else {
        console.log("Registration failed:", data.message || "Unknown error");
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error during registration or login:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create Account 👨‍🍳</h2>
        <p>Sign up to start saving your favorite recipes!</p>

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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        <p className="register-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

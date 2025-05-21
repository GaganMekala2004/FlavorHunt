import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import './Header.css';

const Header = ({ query, setQuery, onSearch }) => {
  const handleSearchClick = () => {
    if (onSearch) onSearch();
  };

  return (
    <header className="header">
      <div className="logo">
        <FaUtensils style={{ marginRight: '8px' }} />
        <span className="flavor">Flavor</span><span className="hunt">Hunt</span>
      </div>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search Recipes..."
          className="search-bar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearchClick}>Search</button>
      </div>
      <div className="auth-links">
        <Link to="/" className="login-btn">Login</Link>
        <Link to="/register" className="register-btn">Register</Link>
      </div>
    </header>
  );
};

export default Header;

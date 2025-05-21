import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Section: About & Credits */}
        <div className="footer-left">
          <p>© 2025 Gagan Sai. All rights reserved.</p>
          <p>Built with ❤️ using MERN Stack</p>
        </div>

        {/* Middle Section: Quick Links (About, Contact, etc.) */}
        <div className="footer-middle">
          <div className="footer-links">
            <a href="#" onClick={() => navigate('/about')} className="footer-link">
              About
            </a>
            <a href="#" onClick={() => navigate('/contact')} className="footer-link">
              Contact
            </a>
            <a href="#" onClick={() => navigate('/terms')} className="footer-link">
              Terms and Conditions
            </a>
          </div>
        </div>

        {/* Right Section: Social Icons (GitHub, LinkedIn) */}
        <div className="footer-right">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FaGithub size={20} style={{ marginRight: '8px' }} /> GitHub
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={20} style={{ marginRight: '8px' }} /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
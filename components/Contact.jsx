import React from 'react';
import './Contact.css'; // Ensure this file exists

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>Connect With Us</h1>
      <p>
        We'd love to hear from you! Follow us or get in touch through the platforms below.
      </p>
      <ul className="contact-links">
        <li>
          <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
            🔗 LinkedIn
          </a>
        </li>
        <li>
          <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
            💻 GitHub
          </a>
        </li>
        <li>
          <a href="mailto:support@flavorhunt.com">📧 Email: support@flavorhunt.com</a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;

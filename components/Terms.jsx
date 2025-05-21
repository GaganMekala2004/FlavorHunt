import React from 'react';
import './Terms.css'; // Make sure to create this CSS file

const Terms = () => {
  return (
    <div className="terms-page">
      <h1>Terms & Conditions</h1>
      <p>
        By using <strong>FlavorHunt</strong>, you agree to use this service for personal, non-commercial purposes only.
      </p>
      <p>
        We do not claim ownership of recipe content sourced from external APIs. All rights belong to the respective owners.
      </p>
      <p>
        Your saved recipes and preferences are private and stored securely in accordance with standard practices.
      </p>
    </div>
  );
};

export default Terms;

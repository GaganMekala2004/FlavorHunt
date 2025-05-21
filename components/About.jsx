import React from 'react';
import './About.css'; // Make sure this matches the file name

const About = () => {
  return (
    <div className="about-page">
      <h1>About FlavorHunt</h1>
      <p>
        FlavorHunt is your personalized recipe companion. Whether you're craving comfort food
        or exploring new cuisines, we help you discover, filter, and save your favorite recipes with ease.
      </p>
      <div className="about-highlight">
        Built with ❤️ using React, Node.js, and MongoDB.
      </div>
      <p>
        Discover new meals, save your favorites, and create your own recipes with ease!
      </p>
    </div>
  );
};

export default About;

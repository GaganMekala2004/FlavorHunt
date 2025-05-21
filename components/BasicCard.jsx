import React from 'react';
import './Card.css';

const BasicCard = ({ image, title, favorite }) => {
  return (
    <div className="basic-card">
      <img src={image} alt={title} className="basic-image" />
      <div className="basic-header">
        <h3>{title}</h3>
        <button className="basic-fav-btn">{favorite ? '♥' : '♡'}</button>
      </div>
    </div>
  );
};

export default BasicCard;

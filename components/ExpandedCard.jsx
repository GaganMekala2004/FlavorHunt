import React from 'react';
import './C.css'; // Ensure styles for expanded cards

const ExpandedCard = ({ image, title, tags = [], extendedIngredients = [], instructions = '', isExpanded }) => {
  return (
    <div className={`recipe-card ${isExpanded ? 'expanded' : ''}`}>
      <img src={image} alt={title} className="recipe-image" />

      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-tags">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))
        ) : (
          <span className="tag">No tags</span>
        )}
      </div>

      {isExpanded && (
  <div className="card-details">
    <section className="ingredients-section">
      <h4>Ingredients</h4>
      {extendedIngredients.length > 0 ? (
        <ul>
          {extendedIngredients.map((item, idx) => (
            <li key={item._id ?? idx}>
              {item.qty ?? item.amount ?? ''} {item.unit ?? ''} {item.name ?? ''}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients listed.</p>
      )}
    </section>

          <section className="instructions-section">
            <h4>Preparation</h4>
            {instructions ? (
              <div dangerouslySetInnerHTML={{ __html: instructions }} />
            ) : (
              <p>No instructions provided.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ExpandedCard;

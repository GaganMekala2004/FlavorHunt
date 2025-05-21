import React from 'react';
import './RecipeFilter.css';

const RecipeFilter = ({ onChange, filters, onShowFavorites, onShowSaved }) => {
  return (
    <div className="filter-container">
      <h3>Filter Recipes</h3>

      <label>Cuisine</label>
      <select name="cuisine" value={filters.cuisine} onChange={onChange}>
        <option value="">-- Select Cuisine --</option>
        <option value="Indian">Indian</option>
        <option value="Italian">Italian</option>
        <option value="Chinese">Chinese</option>
        <option value="American">American</option>
      </select>

      <label>Diet</label>
      <select name="diet" value={filters.diet} onChange={onChange}>
        <option value="">-- Select Diet --</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Vegan">Vegan</option>
        <option value="Gluten Free">Gluten Free</option>
        <option value="Ketogenic">Ketogenic</option>
      </select>

      <label>Meal Type</label>
      <select name="mealType" value={filters.mealType} onChange={onChange}>
        <option value="">-- Select Meal --</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Main course">Main course</option>
        <option value="Dessert">Dessert</option>
        <option value="Salad">Salad</option>
      </select>

      <label>Prep Time</label>
      <select name="prepTime" value={filters.prepTime} onChange={onChange}>
        <option value="">-- Select Prep Time --</option>
        <option value="15">Under 15 mins</option>
        <option value="30">Under 30 mins</option>
        <option value="60">Under 60 mins</option>
      </select>

      <label>Main Ingredient</label>
      <select name="ingredient" value={filters.ingredient} onChange={onChange}>
        <option value="">-- Select Ingredient --</option>
        <option value="Chicken">Chicken</option>
        <option value="Paneer">Paneer</option>
        <option value="Egg">Egg</option>
        <option value="Mushroom">Mushroom</option>
      </select>

      <div className="filter-buttons">
        <button onClick={onShowFavorites}>♥ Show Favorites</button>
        <button onClick={onShowSaved}>📥 Show Saved</button>
      </div>
    </div>
  );
};

export default RecipeFilter;

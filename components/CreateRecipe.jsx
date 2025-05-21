import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRecipe.css';

const CreateRecipe = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', qty: '' }]);
  const [instructions, setInstructions] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [dietType, setDietType] = useState('');
  const [mealType, setMealType] = useState('');
  const [prepTime, setPrepTime] = useState('');

  const handleIngredientChange = (index, field, value) => {
    console.log(`Ingredient change at index ${index}, field: ${field}, value: ${value}`);
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    console.log("Adding new ingredient");
    setIngredients([...ingredients, { name: '', qty: '' }]);
  };

  const removeIngredient = (index) => {
    console.log(`Removing ingredient at index ${index}`);
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
      title,
      image,
      ingredients,
      instructions: instructions.split('\n'),
      cuisine,
      dietType,
      mealType,
      prepTime: Number(prepTime),
    };

    console.log("Submitting recipe:", recipeData);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("User not logged in. Token not found.");
        return alert("User not logged in");
      }

      console.log("JWT Token retrieved from localStorage:", token);
      console.log("Sending recipe data to backend with token:", token);

      const response = await fetch('http://localhost:5000/api/recipes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // ✅ Correct format for authMiddleware
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.ok) {
        console.log("Recipe created successfully, navigating to /home");
        navigate('/home');
      } else {
        console.log("Failed to create recipe:", data.message || 'Unknown error');
        alert(data.message || 'Failed to create recipe');
      }
    } catch (err) {
      console.error("Error submitting recipe:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Create Your Recipe 🍳</h2>
      <form className="recipe-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Recipe Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />

        <div className="ingredients-section">
          <h4>Ingredients</h4>
          {ingredients.map((ing, index) => (
            <div className="ingredient-row" key={index}>
              <input
                type="text"
                placeholder="Name"
                value={ing.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ing.qty}
                onChange={(e) => handleIngredientChange(index, 'qty', e.target.value)}
              />
              <button type="button" onClick={() => removeIngredient(index)}>❌</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addIngredient}>+ Add Ingredient</button>
        </div>

        <div className="select-section">
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} required>
            <option value="">Select Cuisine</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
          </select>

          <select value={dietType} onChange={(e) => setDietType(e.target.value)} required>
            <option value="">Select Diet Type</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Ketogenic">Ketogenic</option>
            <option value="Pescetarian">Pescetarian</option>
          </select>

          <select value={mealType} onChange={(e) => setMealType(e.target.value)} required>
            <option value="">Select Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>

        <input
          type="number"
          placeholder="Prep & Cook Time (mins)"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          required
        />

        <textarea
          placeholder="Preparation Steps (one step per line)"
          rows="6"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Create Recipe</button>
      </form>
    </div>
  );
};

export default CreateRecipe;

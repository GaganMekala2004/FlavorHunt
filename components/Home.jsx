import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import RecipeFilter from './RecipeFilter';
import BasicCard from './BasicCard';
import ExpandedCard from './ExpandedCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [expandedRecipeDetails, setExpandedRecipeDetails] = useState(null);
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    cuisine: '',
    diet: '',
    mealType: '',
    prepTime: '',
    ingredient: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showingSaved, setShowingSaved] = useState(false); // track if showing saved recipes

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleCardClick = async (index) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null);
      setExpandedRecipeDetails(null);
      return;
    }

    setErrorMessage('');
    const selectedRecipe = recipes[index];

    try {
      if (showingSaved) {
        // For saved recipes, you already have full details in the recipe object
        setExpandedRecipeDetails(selectedRecipe);
        setExpandedCardIndex(index);
      } else {
        // For Spoonacular recipes fetch details from backend
        const res = await axios.get(`/api/recipes/details/${selectedRecipe.id}`);
        if (res.data) {
          setExpandedRecipeDetails(res.data);
          setExpandedCardIndex(index);
        } else {
          setErrorMessage('Failed to load detailed recipe info.');
        }
      }
    } catch (err) {
      console.error('Error fetching detailed recipe:', err);
      setErrorMessage('Failed to fetch detailed recipe info.');
    }
  };

  const handleSearch = async () => {
    setErrorMessage('');
    setShowingSaved(false);
    try {
      const res = await axios.get('/api/recipes/search', {
        params: {
          query,
          cuisine: filters.cuisine,
          diet: filters.diet,
          mealType: filters.mealType,
          prepTime: filters.prepTime,
          ingredient: filters.ingredient
        }
      });

      if (res.data && res.data.results) {
        setRecipes(res.data.results);
      } else {
        setErrorMessage("No recipes found. Please try again.");
        setRecipes([]);
      }
      setExpandedCardIndex(null);
      setExpandedRecipeDetails(null);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setErrorMessage("Failed to fetch data from Spoonacular.");
      setRecipes([]);
    }
  };

  const handleShowSaved = async () => {
    setErrorMessage('');
    setShowingSaved(true);
    setExpandedCardIndex(null);
    setExpandedRecipeDetails(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to view saved recipes.');
        setRecipes([]);
        return;
      }

      const res = await axios.get('/api/recipes/saved', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && Array.isArray(res.data)) {
        setRecipes(res.data);
      } else {
        setErrorMessage('No saved recipes found.');
        setRecipes([]);
      }
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setErrorMessage('Failed to fetch saved recipes.');
      setRecipes([]);
    }
  };

  return (
    <div>
      <Header query={query} setQuery={setQuery} onSearch={handleSearch} />

      <div className="hero-section">
        <h1>Discover Delicious Recipes</h1>
        <p>Filter, explore, and create your own favorite dishes.</p>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <RecipeFilter
            onChange={handleFilterChange}
            filters={filters}
            onShowFavorites={() => { /* your favorites handler */ }}
            onShowSaved={handleShowSaved}
          />
        </div>

        <div className="right-panel">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="home-cards-container">
            {recipes.map((item, index) => (
              <div
                key={item._id || item.id}
                onClick={() => handleCardClick(index)}
                className="home-recipe-card-wrapper"
              >
                {expandedCardIndex === index && expandedRecipeDetails ? (
                  <ExpandedCard
                    image={expandedRecipeDetails.image}
                    title={expandedRecipeDetails.title}
                    tags={expandedRecipeDetails.dishTypes || []}
                    extendedIngredients={expandedRecipeDetails.extendedIngredients || []}
                    instructions={
                      typeof expandedRecipeDetails.instructions === 'string'
                        ? expandedRecipeDetails.instructions
                        : expandedRecipeDetails.instructions?.join('\n') || 'No instructions provided'
                    }
                    isExpanded={true}
                  />
                ) : (
                  <BasicCard
                    image={item.image}
                    title={item.title}
                    favorite={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="fab-create" onClick={() => navigate('/create')}>
        ➕
      </button>

      <Footer />
    </div>
  );
};

export default Home;

import express from 'express';
import axios from 'axios';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

console.log("Loaded Spoonacular API Key:", process.env.SPOONACULAR_API_KEY);

// Public route: Search Spoonacular Recipes (title + image for BasicCard)
router.get('/search', async (req, res) => {
  try {
    const { query, cuisine, diet, mealType, prepTime, ingredient } = req.query;

    console.log('Search API called with params:', req.query);

    const params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
      number: 9,
      addRecipeInformation: false,
    };

    if (query) params.query = query;
    if (cuisine) params.cuisine = cuisine;
    if (diet) params.diet = diet;
    if (mealType) params.type = mealType;
    if (prepTime) params.maxReadyTime = prepTime;
    if (ingredient) params.includeIngredients = ingredient;

    console.log('Calling Spoonacular with params:', params);

    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });

    console.log('Spoonacular response status:', response.status);
    console.log('Spoonacular response data:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular search error details:', {
      message: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
    });
    res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular.' });
  }
});

// New route: Get detailed recipe info by ID for ExpandedCard
router.get('/details/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;

    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    const params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
      includeNutrition: false,
    };

    console.log(`Fetching detailed recipe info for ID: ${recipeId}`);

    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, { params });

    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular details fetch error:', {
      message: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
    });
    res.status(500).json({ error: 'Failed to fetch recipe details from Spoonacular.' });
  }
});

// Protect all routes below with JWT middleware
router.use(authMiddleware);

// POST: Create Custom Recipe
router.post('/create', async (req, res) => {
  try {
    console.log("Create Recipe route hit");
    console.log("Request body:", req.body);
    console.log("Authenticated user ID:", req.userId);

    const { title, image, ingredients, instructions, cuisine, dietType, mealType, prepTime } = req.body;
    const userId = req.userId;

    const newRecipe = new Recipe({
      title,
      image,
      ingredients,
      instructions,
      cuisine,
      dietType,
      mealType,
      prepTime,
      userId,
      createdAt: new Date(),
    });

    await newRecipe.save();

    await User.findByIdAndUpdate(userId, {
      $push: { customRecipes: newRecipe._id },
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).send('Server Error');
  }
});

// GET: Fetch Saved Recipes for Logged-in User
router.get('/saved', async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching saved recipes for user:", userId);

    const user = await User.findById(userId).populate('customRecipes');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.customRecipes); // these are full recipe documents
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

export default router;

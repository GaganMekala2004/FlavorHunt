import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { createTestApp } from './helpers/testApp.js';

describe('FlavorHunt Recipes API (FH-TC-011 to FH-TC-018)', () => {
  const app = createTestApp();
  const validUserId = new mongoose.Types.ObjectId().toString();
  const authHeader = `Bearer ${jwt.sign(
    { userId: validUserId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )}`;

  const validRecipePayload = {
    title: 'Paneer Tikka Masala',
    image: 'https://example.com/paneer.jpg',
    ingredients: [
      { name: 'Paneer', qty: '250g' },
      { name: 'Tomato Puree', qty: '1 cup' },
    ],
    instructions: ['Marinate paneer cubes', 'Simmer in spiced tomato gravy'],
    cuisine: 'Indian',
    dietType: 'Vegetarian',
    mealType: 'Dinner',
    prepTime: 35,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('FH-TC-011: should search Spoonacular recipes and map all filter query params', async () => {
    const mockSpoonacularResponse = {
      status: 200,
      data: {
        results: [
          { id: 716429, title: 'Pasta with Garlic', image: 'https://img.test/pasta.jpg' },
        ],
        totalResults: 1,
      },
    };
    const axiosSpy = vi.spyOn(axios, 'get').mockResolvedValue(mockSpoonacularResponse);

    const res = await request(app).get('/api/recipes/search').query({
      query: 'pasta',
      cuisine: 'Italian',
      diet: 'Vegetarian',
      mealType: 'Dinner',
      prepTime: '30',
      ingredient: 'garlic',
    });

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].title).toBe('Pasta with Garlic');
    expect(axiosSpy).toHaveBeenCalledWith(
      'https://api.spoonacular.com/recipes/complexSearch',
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          number: 9,
          addRecipeInformation: false,
          query: 'pasta',
          cuisine: 'Italian',
          diet: 'Vegetarian',
          type: 'Dinner',
          maxReadyTime: '30',
          includeIngredients: 'garlic',
        },
      }
    );
  });

  it('FH-TC-012: should return 500 when Spoonacular search API fails', async () => {
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Spoonacular quota exceeded'));

    const res = await request(app).get('/api/recipes/search').query({ query: 'curry' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to fetch recipes from Spoonacular.' });
  });

  it('FH-TC-013: should fetch detailed recipe info by ID from Spoonacular', async () => {
    const mockDetails = {
      status: 200,
      data: {
        id: 716429,
        title: 'Pasta with Garlic',
        readyInMinutes: 45,
        extendedIngredients: [{ name: 'garlic' }],
      },
    };
    const axiosSpy = vi.spyOn(axios, 'get').mockResolvedValue(mockDetails);

    const res = await request(app).get('/api/recipes/details/716429');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(716429);
    expect(res.body.title).toBe('Pasta with Garlic');
    expect(axiosSpy).toHaveBeenCalledWith(
      'https://api.spoonacular.com/recipes/716429/information',
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          includeNutrition: false,
        },
      }
    );
  });

  it('FH-TC-014: should return 500 when Spoonacular rejects a non-existent recipe ID', async () => {
    const notFoundErr = Object.assign(new Error('Request failed with status code 404'), {
      response: { status: 404, data: { message: 'Recipe not found' } },
    });
    vi.spyOn(axios, 'get').mockRejectedValue(notFoundErr);

    const res = await request(app).get('/api/recipes/details/999999999');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'Failed to fetch recipe details from Spoonacular.',
    });
  });

  it('FH-TC-015: should create a custom recipe for authenticated user and link it to User', async () => {
    vi.spyOn(Recipe.prototype, 'save').mockImplementation(async function () {
      const validationErr = this.validateSync();
      if (validationErr) throw validationErr;
      return this;
    });
    const updateUserSpy = vi
      .spyOn(User, 'findByIdAndUpdate')
      .mockResolvedValue({ _id: validUserId });

    const res = await request(app)
      .post('/api/recipes/create')
      .set('Authorization', authHeader)
      .send(validRecipePayload);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(validRecipePayload.title);
    expect(res.body.cuisine).toBe('Indian');
    expect(res.body.prepTime).toBe(35);
    expect(res.body.userId).toBe(validUserId);
    expect(updateUserSpy).toHaveBeenCalledWith(validUserId, {
      $push: { customRecipes: expect.any(mongoose.Types.ObjectId) },
    });
  });

  it('FH-TC-016: should deny custom recipe creation when unauthenticated', async () => {
    const res = await request(app)
      .post('/api/recipes/create')
      .send(validRecipePayload);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'No token, authorization denied' });
  });

  it('FH-TC-017: should fail custom recipe creation when required Mongoose fields are missing', async () => {
    vi.spyOn(Recipe.prototype, 'save').mockImplementation(async function () {
      const validationErr = this.validateSync();
      if (validationErr) throw validationErr;
      return this;
    });

    const res = await request(app)
      .post('/api/recipes/create')
      .set('Authorization', authHeader)
      .send({ title: 'Incomplete Recipe Only' });

    expect(res.status).toBe(500);
    expect(res.text).toBe('Server Error');
  });

  it('FH-TC-018: should return populated saved recipes for user and 404 when user is not found', async () => {
    const mockSavedRecipes = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        title: 'Saved Masala Dosa',
        cuisine: 'Indian',
        prepTime: 25,
      },
    ];
    vi.spyOn(User, 'findById').mockReturnValue({
      populate: vi.fn().mockResolvedValue({
        _id: validUserId,
        customRecipes: mockSavedRecipes,
      }),
    });

    const okRes = await request(app)
      .get('/api/recipes/saved')
      .set('Authorization', authHeader);

    expect(okRes.status).toBe(200);
    expect(okRes.body).toHaveLength(1);
    expect(okRes.body[0].title).toBe('Saved Masala Dosa');

    vi.spyOn(User, 'findById').mockReturnValue({
      populate: vi.fn().mockResolvedValue(null),
    });

    const notFoundRes = await request(app)
      .get('/api/recipes/saved')
      .set('Authorization', authHeader);

    expect(notFoundRes.status).toBe(404);
    expect(notFoundRes.body).toEqual({ error: 'User not found' });
  });
});

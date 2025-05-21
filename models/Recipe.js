import mongoose from 'mongoose';

const { Schema } = mongoose;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      qty: { type: String, required: true },
    },
  ],
  instructions: { type: [String], required: true },
  cuisine: { type: String, required: true },
  dietType: { type: String, required: true },
  mealType: { type: String, required: true },
  prepTime: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model('CustomRecipe', recipeSchema, 'customrecipies');

export default Recipe;

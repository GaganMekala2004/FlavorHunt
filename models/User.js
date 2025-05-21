import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  favoriteRecipes: [String],
  customRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "CustomRecipe" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);

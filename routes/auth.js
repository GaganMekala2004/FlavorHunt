import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import JWT
import User from "../models/User.js";

const router = express.Router();
const saltRounds = 10;

// Secret key for JWT, make sure this is stored securely in your .env file
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in environment");
}

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("Register route hit with:", email);
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hash });
    await newUser.save();
    console.log("User registered:", newUser._id);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login route hit with:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed - user not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Login failed - incorrect password for:", email);
      return res.status(401).json({ message: "Incorrect password" });
    }

    console.log("Login successful for:", user._id);

    // Generate JWT token after successful login
    console.log("Generating JWT token for user:", user._id); // Log before token generation
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour
    console.log("Generated JWT token:", token); // Log the generated token

    // Send back the token to the frontend
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

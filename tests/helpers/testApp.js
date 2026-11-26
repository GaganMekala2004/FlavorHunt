import express from 'express';
import authRoutes from '../../routes/auth.js';
import recipeRoutes from '../../routes/recipes.js';

export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/recipes', recipeRoutes);
  return app;
}

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    env: {
      JWT_SECRET: 'test-jwt-secret-flavorhunt-qa-suite',
      SPOONACULAR_API_KEY: 'test-spoonacular-api-key',
    },
    clearMocks: true,
    restoreMocks: true,
  },
});

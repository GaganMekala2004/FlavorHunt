import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createTestApp } from './helpers/testApp.js';

describe('FlavorHunt Auth Middleware (FH-TC-008 to FH-TC-010)', () => {
  const app = createTestApp();

  it('FH-TC-008: should reject protected route access when Authorization header is missing', async () => {
    const res = await request(app).get('/api/recipes/saved');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'No token, authorization denied' });
  });

  it('FH-TC-009: should reject protected route access when Authorization header lacks Bearer prefix', async () => {
    const token = jwt.sign(
      { userId: '507f1f77bcf86cd799439011' },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .get('/api/recipes/saved')
      .set('Authorization', `Token ${token}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'No token, authorization denied' });
  });

  it('FH-TC-010: should reject protected route access when JWT is invalid or expired', async () => {
    const invalidRes = await request(app)
      .get('/api/recipes/saved')
      .set('Authorization', 'Bearer malformed.jwt.token');

    expect(invalidRes.status).toBe(401);
    expect(invalidRes.body).toEqual({ message: 'Token is not valid' });

    const expiredToken = jwt.sign(
      { userId: '507f1f77bcf86cd799439011' },
      process.env.JWT_SECRET,
      { expiresIn: -10 }
    );
    const expiredRes = await request(app)
      .get('/api/recipes/saved')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(expiredRes.status).toBe(401);
    expect(expiredRes.body).toEqual({ message: 'Token is not valid' });
  });
});

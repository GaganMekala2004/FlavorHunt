import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createTestApp } from './helpers/testApp.js';

describe('FlavorHunt Authentication API (FH-TC-001 to FH-TC-007)', () => {
  const app = createTestApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('FH-TC-001: should register a new user successfully with hashed password', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue(null);
    let savedDoc = null;
    vi.spyOn(User.prototype, 'save').mockImplementation(async function () {
      savedDoc = this;
      return this;
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'chef@flavorhunt.test', password: 'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'User registered successfully' });
    expect(savedDoc).not.toBeNull();
    expect(savedDoc.email).toBe('chef@flavorhunt.test');
    expect(savedDoc.password).not.toBe('Password123!');
    expect(await bcrypt.compare('Password123!', savedDoc.password)).toBe(true);
  });

  it('FH-TC-002: should reject duplicate user registration with 400', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'existing@flavorhunt.test',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'existing@flavorhunt.test', password: 'Password123!' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'User already exists' });
  });

  it('FH-TC-003: should return 500 when password is missing during registration', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nopass@flavorhunt.test' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  it('FH-TC-004: should return 500 when database fails during registration', async () => {
    vi.spyOn(User, 'findOne').mockRejectedValue(new Error('MongoDB connection lost'));

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dberr@flavorhunt.test', password: 'Password123!' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  it('FH-TC-005: should log in a valid user and return a signed JWT token', async () => {
    const hashedPassword = await bcrypt.hash('CorrectPass123!', 10);
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'chef@flavorhunt.test',
      password: hashedPassword,
    };
    vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'chef@flavorhunt.test', password: 'CorrectPass123!' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(typeof res.body.token).toBe('string');

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(mockUser._id);
  });

  it('FH-TC-006: should return 404 when logging in with a non-existent email', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@flavorhunt.test', password: 'Password123!' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('FH-TC-007: should return 401 when logging in with an incorrect password', async () => {
    const hashedPassword = await bcrypt.hash('CorrectPass123!', 10);
    vi.spyOn(User, 'findOne').mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'chef@flavorhunt.test',
      password: hashedPassword,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'chef@flavorhunt.test', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Incorrect password' });
  });
});

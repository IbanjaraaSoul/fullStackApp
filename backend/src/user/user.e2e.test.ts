import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { large, createMockCreateUserRequest } from '../test/setup';
import { AppModule } from '../app.module';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

// Large tests: Full network access, external systems, long timeouts
// Test complete HTTP flow and real database interactions

describe('User E2E Tests - Large Tests', () => {
  let app: INestApplication;
  let userRepository: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(UserEntity));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await userRepository.clear();
  });

  large('complete user CRUD flow through HTTP endpoints', async () => {
    const createUserData = createMockCreateUserRequest();

    // 1. Create user
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserData)
      .expect(201);

    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.email).toBe(createUserData.email);
    expect(createResponse.body.name).toBe(createUserData.name);
    expect(createResponse.body).toHaveProperty('createdAt');
    expect(createResponse.body).toHaveProperty('updatedAt');

    const userId = createResponse.body.id;

    // 2. Get user by ID
    const getResponse = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(getResponse.body.id).toBe(userId);
    expect(getResponse.body.email).toBe(createUserData.email);

    // 3. Update user
    const updateData = { name: 'Updated Name' };
    const updateResponse = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateData)
      .expect(200);

    expect(updateResponse.body.name).toBe(updateData.name);
    expect(updateResponse.body.email).toBe(createUserData.email); // Unchanged

    // 4. Get all users
    const getAllResponse = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(getAllResponse.body)).toBe(true);
    expect(getAllResponse.body).toHaveLength(1);
    expect(getAllResponse.body[0].id).toBe(userId);

    // 5. Delete user
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200);

    // 6. Verify user is deleted
    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(404);
  });

  large('handles duplicate email creation gracefully', async () => {
    const createUserData = createMockCreateUserRequest();

    // Create first user
    const firstResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserData)
      .expect(201);

    // Try to create second user with same email
    const secondResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserData)
      .expect(400);

    expect(secondResponse.body.message).toBe('User with this email already exists');
  });

  large('handles invalid user data validation', async () => {
    const invalidUserData = {
      email: 'invalid-email',
      name: '', // Empty name
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData)
      .expect(400);

    expect(response.body.message).toContain('Validation failed');
  });

  large('handles non-existent user operations', async () => {
    const nonExistentUserId = 999;

    // Try to get non-existent user
    await request(app.getHttpServer())
      .get(`/users/${nonExistentUserId}`)
      .expect(404);

    // Try to update non-existent user
    await request(app.getHttpServer())
      .put(`/users/${nonExistentUserId}`)
      .send({ name: 'New Name' })
      .expect(404);

    // Try to delete non-existent user
    await request(app.getHttpServer())
      .delete(`/users/${nonExistentUserId}`)
      .expect(404);
  });

  large('handles malformed JSON requests', async () => {
    const malformedJson = '{"email": "test@example.com", "name": "Test User"'; // Missing closing brace

    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(malformedJson)
      .expect(400);

    expect(response.body.message).toContain('Expected');
  });

  large('handles concurrent user creation', async () => {
    const createUserData = createMockCreateUserRequest();
    const concurrentRequests = 5;

    // Send multiple concurrent requests
    const promises = Array.from({ length: concurrentRequests }, (_, index) => {
      const userData = {
        ...createUserData,
        email: `user${index}@example.com`,
        name: `User ${index}`,
      };
      
      return request(app.getHttpServer())
        .post('/users')
        .send(userData);
    });

    const responses = await Promise.all(promises);

    // All should succeed
    responses.forEach(response => {
      expect(response.status).toBe(201);
    });

    // Verify all users were created
    const getAllResponse = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(getAllResponse.body).toHaveLength(concurrentRequests);
  });

  large('handles large user datasets', async () => {
    const userCount = 100;
    const users = [];

    // Create many users
    for (let i = 0; i < userCount; i++) {
      const userData = {
        email: `user${i}@example.com`,
        name: `User ${i}`,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      users.push(response.body);
    }

    // Verify all users can be retrieved
    const getAllResponse = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(getAllResponse.body).toHaveLength(userCount);

    // Note: Pagination is not implemented yet
    // When implemented, this would test the actual pagination logic
    // For now, we just verify all users are returned
    expect(getAllResponse.body).toHaveLength(userCount);
  });
});

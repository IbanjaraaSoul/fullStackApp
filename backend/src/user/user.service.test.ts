import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { medium, createMockUser, createMockCreateUserRequest, getTestDatabase } from '../test/setup';
import { UserService } from './user.service';
import { UserEntity, User, CreateUser } from './user.entity';

// Medium tests: localhost only, DB access allowed, file system allowed
// Test service layer with mocked dependencies

describe('User Service - Medium Tests', () => {
  let userService: UserService;
  let mockUserRepository: any;
  let testDb: any;

  beforeEach(async () => {
    testDb = await getTestDatabase();
    
    // Mock repository
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    userService = new UserService(mockUserRepository as any);
  });

  medium('createUser successfully creates a new user', async () => {
    const createUserData = createMockCreateUserRequest();
    const mockUserEntity = new UserEntity();
    Object.assign(mockUserEntity, createUserData);
    mockUserEntity.id = 1;
    mockUserEntity.createdAt = new Date();
    mockUserEntity.updatedAt = new Date();

    mockUserRepository.create.mockReturnValue(mockUserEntity);
    mockUserRepository.save.mockResolvedValue(mockUserEntity);

    const result = await userService.createUser(createUserData);

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.email).toBe(createUserData.email);
      expect(result.right.name).toBe(createUserData.name);
      expect(result.right.id).toBe(1);
    }
    expect(mockUserRepository.create).toHaveBeenCalledWith(createUserData);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserEntity);
  });

  medium('createUser handles duplicate email constraint violation', async () => {
    const createUserData = createMockCreateUserRequest();
    const constraintError = new Error('Duplicate email');
    (constraintError as any).code = '23505'; // PostgreSQL unique constraint violation

    mockUserRepository.create.mockReturnValue(new UserEntity());
    mockUserRepository.save.mockRejectedValue(constraintError);

    const result = await userService.createUser(createUserData);

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe('User with this email already exists');
    }
  });

  medium('createUser handles database save errors', async () => {
    const createUserData = createMockCreateUserRequest();
    const dbError = new Error('Database connection failed');

    mockUserRepository.create.mockReturnValue(new UserEntity());
    mockUserRepository.save.mockRejectedValue(dbError);

    const result = await userService.createUser(createUserData);

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toContain('Failed to create user');
    }
  });

  medium('getAllUsers returns empty array when no users exist', async () => {
    mockUserRepository.find.mockResolvedValue([]);

    const result = await userService.getAllUsers();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toEqual([]);
    }
  });

  medium('getAllUsers returns array of users when users exist', async () => {
    const mockUsers = [
      createMockUser(),
      { ...createMockUser(), id: 2, email: 'user2@example.com', name: 'User 2' },
    ];

    const mockUserEntities = mockUsers.map(user => {
      const entity = new UserEntity();
      Object.assign(entity, user);
      // Mock the toUser method
      (entity as any).toUser = jest.fn().mockReturnValue(user);
      return entity;
    });

    mockUserRepository.find.mockResolvedValue(mockUserEntities);

    const result = await userService.getAllUsers();

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toHaveLength(2);
      expect(result.right[0].email).toBe(mockUsers[0].email);
      expect(result.right[1].email).toBe(mockUsers[1].email);
    }
  });

  medium('getUserById returns user when found', async () => {
    const mockUser = createMockUser();
    const mockUserEntity = new UserEntity();
    Object.assign(mockUserEntity, mockUser);
    // Mock the toUser method
    (mockUserEntity as any).toUser = jest.fn().mockReturnValue(mockUser);

    mockUserRepository.findOne.mockResolvedValue(mockUserEntity);

    const result = await userService.getUserById(1);

    expect(O.isSome(result)).toBe(true);
    if (O.isSome(result)) {
      expect(result.value.id).toBe(1);
      expect(result.value.email).toBe(mockUser.email);
    }
  });

  medium('getUserById returns none when user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const result = await userService.getUserById(999);

    expect(O.isNone(result)).toBe(true);
  });

  medium('getUserByEmail returns user when found', async () => {
    const mockUser = createMockUser();
    const mockUserEntity = new UserEntity();
    Object.assign(mockUserEntity, mockUser);
    // Mock the toUser method
    (mockUserEntity as any).toUser = jest.fn().mockReturnValue(mockUser);

    mockUserRepository.findOne.mockResolvedValue(mockUserEntity);

    const result = await userService.getUserByEmail('test@example.com');

    expect(O.isSome(result)).toBe(true);
    if (O.isSome(result)) {
      expect(result.value.email).toBe('test@example.com');
    }
  });

  medium('updateUser successfully updates existing user', async () => {
    const mockUser = createMockUser();
    const mockUserEntity = new UserEntity();
    Object.assign(mockUserEntity, mockUser);
    // Mock the toUser method
    (mockUserEntity as any).toUser = jest.fn().mockReturnValue(mockUser);

    const updateData = { name: 'Updated Name' };
    const updatedEntity = { ...mockUserEntity, name: 'Updated Name' };
    // Mock the toUser method for updated entity
    (updatedEntity as any).toUser = jest.fn().mockReturnValue({ ...mockUser, name: 'Updated Name' });

    mockUserRepository.findOne.mockResolvedValue(mockUserEntity);
    mockUserRepository.save.mockResolvedValue(updatedEntity);

    const result = await userService.updateUser(1, updateData);

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.name).toBe('Updated Name');
      expect(result.right.email).toBe(mockUser.email); // Unchanged
    }
  });

  medium('updateUser returns error when user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const result = await userService.updateUser(999, { name: 'New Name' });

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe('User not found');
    }
  });

  medium('deleteUser successfully deletes existing user', async () => {
    mockUserRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await userService.deleteUser(1);

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toBe(true);
    }
    expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
  });

  medium('deleteUser returns error when user not found', async () => {
    mockUserRepository.delete.mockResolvedValue({ affected: 0 });

    const result = await userService.deleteUser(999);

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left).toBe('User not found');
    }
  });
});

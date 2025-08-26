import { jest } from '@jest/globals';

// Test categorization utilities
export const testCategories = {
  SMALL: 'small',
  MEDIUM: 'medium', 
  LARGE: 'large',
} as const;

export type TestCategory = typeof testCategories[keyof typeof testCategories];

// Simple test decorators
export const small = (testName: string, testFn: () => void | Promise<void>) => {
  describe(`[Small] ${testName}`, () => {
    beforeAll(() => {
      jest.setTimeout(60000); // 60 seconds max
    });
    
    it(testName, testFn);
  });
};

export const medium = (testName: string, testFn: () => void | Promise<void>) => {
  describe(`[Medium] ${testName}`, () => {
    beforeAll(() => {
      jest.setTimeout(300000); // 5 minutes max
    });
    
    it(testName, testFn);
  });
};

export const large = (testName: string, testFn: () => void | Promise<void>) => {
  describe(`[Large] ${testName}`, () => {
    beforeAll(() => {
      jest.setTimeout(900000); // 15 minutes max
    });
    
    it(testName, testFn);
  });
};

// Common test utilities
export const createMockUser = () => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createMockCreateUserRequest = () => ({
  email: 'newuser@example.com',
  name: 'New User',
});

// Test database utilities
export const getTestDatabase = async () => {
  // This would connect to a test database
  // For now, return a mock
  return {
    users: [],
    addUser: jest.fn(),
    getUserById: jest.fn(),
    getAllUsers: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };
};



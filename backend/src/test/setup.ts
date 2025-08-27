import { jest } from '@jest/globals';

// Test categorization utilities
export const testCategories = {
  SMALL: 'small',
  MEDIUM: 'medium', 
  LARGE: 'large',
} as const;

export type TestCategory = typeof testCategories[keyof typeof testCategories];

// Test decorators that properly categorize tests for Jest
export const small = (testName: string, testFn: () => void | Promise<void>) => {
  it(`[Small] ${testName}`, testFn, 60000); // 60 seconds max
};

export const medium = (testName: string, testFn: () => void | Promise<void>) => {
  it(`[Medium] ${testName}`, testFn, 300000); // 5 minutes max
};

export const large = (testName: string, testFn: () => void | Promise<void>) => {
  it(`[Large] ${testName}`, testFn, 900000); // 15 minutes max
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



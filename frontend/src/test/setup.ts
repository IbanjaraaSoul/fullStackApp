import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock axios globally
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

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

// Mock API responses
export const mockApiResponses = {
  users: [
    createMockUser(),
    {
      id: 2,
      email: 'user2@example.com',
      name: 'User Two',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  
  createUser: createMockUser(),
  
  updateUser: {
    id: 1,
    email: 'test@example.com',
    name: 'Updated User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  deleteUser: { success: true },
};

// Mock external services
export const ExternalServiceMock = {
  alwaysReturnsOk: () => ({
    call: jest.fn().mockResolvedValue({ success: true }),
  }),
  
  alwaysFails: (error: string) => ({
    call: jest.fn().mockRejectedValue(new Error(error)),
  }),
  
  returnsData: (data: any) => ({
    call: jest.fn().mockResolvedValue(data),
  }),
};

import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { User, CreateUser, UpdateUser, UserCodec } from '../types/user';

const API_BASE_URL = '/api';

// Configure axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(new Error(error.message || 'Network error'));
  }
);

export const userApi = {
  // Get all users
  async getAllUsers(): Promise<E.Either<string, User[]>> {
    try {
      const response = await api.get('/users');
      const users = response.data;
      
      // Validate response with fp-ts
      const validationResult = t.array(UserCodec).decode(users);
      
      if (validationResult._tag === 'Left') {
        return E.left(`Invalid user data: ${JSON.stringify(validationResult.left)}`);
      }
      
      return E.right(validationResult.right);
    } catch (error) {
      return E.left(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  },

  // Get user by ID
  async getUserById(id: number): Promise<E.Either<string, User>> {
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      
      // Validate response with fp-ts
      const validationResult = UserCodec.decode(user);
      
      if (validationResult._tag === 'Left') {
        return E.left(`Invalid user data: ${JSON.stringify(validationResult.left)}`);
      }
      
      return E.right(validationResult.right);
    } catch (error) {
      return E.left(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  },

  // Create user
  async createUser(userData: CreateUser): Promise<E.Either<string, User>> {
    try {
      const response = await api.post('/users', userData);
      const user = response.data;
      
      // Validate response with fp-ts
      const validationResult = UserCodec.decode(user);
      
      if (validationResult._tag === 'Left') {
        return E.left(`Invalid user data: ${JSON.stringify(validationResult.left)}`);
      }
      
      return E.right(validationResult.right);
    } catch (error) {
      return E.left(error instanceof Error ? error.message : 'Failed to create user');
    }
  },

  // Update user
  async updateUser(id: number, userData: UpdateUser): Promise<E.Either<string, User>> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      const user = response.data;
      
      // Validate response with fp-ts
      const validationResult = UserCodec.decode(user);
      
      if (validationResult._tag === 'Left') {
        return E.left(`Invalid user data: ${JSON.stringify(validationResult.left)}`);
      }
      
      return E.right(validationResult.right);
    } catch (error) {
      return E.left(error instanceof Error ? error.message : 'Failed to update user');
    }
  },

  // Delete user
  async deleteUser(id: number): Promise<E.Either<string, boolean>> {
    try {
      await api.delete(`/users/${id}`);
      return E.right(true);
    } catch (error) {
      return E.left(error instanceof Error ? error.message : 'Failed to delete user');
    }
  },
};

import { describe, it, expect } from '@jest/globals';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { small, createMockCreateUserRequest } from '../test/setup';
import { CreateUserCodec, UserCodec } from './user.entity';

// Small tests: No network, no DB, no file system, no external systems
// Focus on pure function validation and business logic

describe('User Validation - Small Tests', () => {
  
  small('CreateUserCodec validates valid user data', () => {
    const validUser = createMockCreateUserRequest();
    
    const result = CreateUserCodec.decode(validUser);
    
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.email).toBe(validUser.email);
      expect(result.right.name).toBe(validUser.name);
    }
  });

  small('CreateUserCodec accepts valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      '123@numbers.com',
      'user-name@domain.org',
    ];
    
    validEmails.forEach(email => {
      const user = { email, name: 'Valid Name' };
      const result = CreateUserCodec.decode(user);
      expect(E.isRight(result)).toBe(true);
    });
  });

  small('CreateUserCodec accepts various name formats', () => {
    const validNames = [
      'John Doe',
      'User123',
      'A'.repeat(100), // 100 character name
      'Test-User',
    ];
    
    validNames.forEach(name => {
      const user = { email: 'test@example.com', name };
      const result = CreateUserCodec.decode(user);
      expect(E.isRight(result)).toBe(true);
    });
  });

  small('CreateUserCodec rejects missing email', () => {
    const invalidUser = {
      name: 'Valid Name',
    } as any;
    
    const result = CreateUserCodec.decode(invalidUser);
    
    expect(E.isLeft(result)).toBe(true);
  });

  small('UserCodec validates complete user data', () => {
    const validUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = UserCodec.decode(validUser);
    
    expect(E.isRight(result)).toBe(true);
  });

  small('UserCodec rejects user with invalid ID type', () => {
    const invalidUser = {
      id: 'not-a-number',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = UserCodec.decode(invalidUser);
    
    expect(E.isLeft(result)).toBe(true);
  });

  small('CreateUserCodec handles edge case email formats', () => {
    const edgeCaseEmails = [
      'test+tag@example.com',
      'test.tag@example.co.uk',
      '123@numbers.com',
      'user-name@domain.org',
    ];
    
    edgeCaseEmails.forEach(email => {
      const user = { email, name: 'Test User' };
      const result = CreateUserCodec.decode(user);
      expect(E.isRight(result)).toBe(true);
    });
  });


});

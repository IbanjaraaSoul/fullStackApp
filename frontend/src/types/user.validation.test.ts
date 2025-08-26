import { UserCodec, CreateUserCodec, UpdateUserCodec } from '../types/user';
import * as E from 'fp-ts/Either';
import { small } from '../test/setup';

describe('User Type Validation - Small Tests', () => {
  small('UserCodec validates complete user data', () => {
    const validUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: '2025-08-26T20:00:00.000Z',
      updatedAt: '2025-08-26T20:00:00.000Z',
    };

    const result = UserCodec.decode(validUser);
    expect(E.isRight(result)).toBe(true);
  });

  small('UserCodec rejects user with invalid ID type', () => {
    const invalidUser = {
      id: 'not-a-number',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: '2025-08-26T20:00:00.000Z',
      updatedAt: '2025-08-26T20:00:00.000Z',
    };

    const result = UserCodec.decode(invalidUser);
    expect(E.isLeft(result)).toBe(true);
  });

  small('UserCodec rejects user with missing required fields', () => {
    const invalidUser = {
      id: 1,
      email: 'test@example.com',
      // missing name
      createdAt: '2025-08-26T20:00:00.000Z',
      updatedAt: '2025-08-26T20:00:00.000Z',
    };

    const result = UserCodec.decode(invalidUser);
    expect(E.isLeft(result)).toBe(true);
  });

  small('CreateUserCodec validates valid user data', () => {
    const validUser = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const result = CreateUserCodec.decode(validUser);
    expect(E.isRight(result)).toBe(true);
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

  small('CreateUserCodec handles edge case email formats', () => {
    const edgeCaseEmails = [
      'a@b.c',
      'very.long.email.address@very.long.domain.name.com',
      'user+tag@domain.com',
    ];
    
    edgeCaseEmails.forEach(email => {
      const user = { email, name: 'Valid Name' };
      const result = CreateUserCodec.decode(user);
      expect(E.isRight(result)).toBe(true);
    });
  });

  small('UpdateUserCodec accepts partial user data', () => {
    const partialUpdates = [
      { name: 'Updated Name' },
      { email: 'newemail@example.com' },
      { name: 'Updated Name', email: 'newemail@example.com' },
      {},
    ];
    
    partialUpdates.forEach(update => {
      const result = UpdateUserCodec.decode(update);
      expect(E.isRight(result)).toBe(true);
    });
  });

  small('UpdateUserCodec validates individual fields when provided', () => {
    const validUpdates = [
      { name: 'Valid Name' },
      { email: 'valid@email.com' },
    ];
    
    validUpdates.forEach(update => {
      const result = UpdateUserCodec.decode(update);
      expect(E.isRight(result)).toBe(true);
    });
  });
});

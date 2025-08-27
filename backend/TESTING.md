# 🧪 Three-Tier Testing Strategy

This document outlines the testing strategy implemented in this project, following the **Three-Tier Testing Strategy** for reliable, fast, and maintainable testing.

## 🎯 **Testing Philosophy Overview**

The Three-Tier approach categorizes tests into three sizes based on their characteristics and execution requirements:

| Feature | Small | Medium | Large |
|---------|-------|--------|-------|
| **Network access** | ❌ No | 🔒 localhost only | ✅ Yes |
| **Database** | ❌ No | ✅ Yes | ✅ Yes |
| **File system access** | ❌ No | ✅ Yes | ✅ Yes |
| **External systems** | ❌ No | ⚠️ Discouraged | ✅ Yes |
| **Multiple threads** | ❌ No | ✅ Yes | ✅ Yes |
| **Sleep statements** | ❌ No | ✅ Yes | ✅ Yes |
| **System properties** | ❌ No | ✅ Yes | ✅ Yes |
| **Time limit** | 60s | 300s | 900s+ |

## 🚀 **Test Categories**

### **Small Tests** `[Small]`
- **Purpose**: Test pure functions, validation logic, and business rules
- **Characteristics**: No external dependencies, fast execution, high reliability
- **Examples**: Input validation, data transformation, utility functions
- **When to use**: Always - these form the foundation of your test suite

```typescript
small('validates user email format', () => {
  const result = validateEmail('test@example.com');
  expect(result).toBe(true);
});
```

### **Medium Tests** `[Medium]`
- **Purpose**: Test service layer, database interactions, and local dependencies
- **Characteristics**: Database access, mocked external services, moderate execution time
- **Examples**: Service methods, repository operations, business logic flows
- **When to use**: For testing integration points and complex business logic

```typescript
medium('creates user in database', async () => {
  const result = await userService.createUser(userData);
  expect(E.isRight(result)).toBe(true);
});
```

### **Large Tests** `[Large]`
- **Purpose**: End-to-end testing, real external systems, complete user flows
- **Characteristics**: Full HTTP flow, real database, external API calls
- **Examples**: API endpoints, complete user journeys, integration scenarios
- **When to use**: Sparingly - only for critical user flows that can't be tested otherwise

```typescript
large('complete user registration flow', async () => {
  const response = await request(app)
    .post('/users')
    .send(userData)
    .expect(201);
  
  expect(response.body.email).toBe(userData.email);
});
```

## 🏗️ **Test Structure**

```
src/
├── test/
│   ├── setup.ts              # Test utilities and categorization
│   └── ...
├── user/
│   ├── user.validation.test.ts    # Small tests - validation logic
│   ├── user.service.test.ts       # Medium tests - service layer
│   └── user.e2e.test.ts          # Large tests - E2E flows
```

## 🧰 **Test Utilities**

### **Test Categorization**
```typescript
import { small, medium, large } from '../test/setup';

small('test name', () => {
  // Small test implementation
});

medium('test name', () => {
  // Medium test implementation
});

large('test name', () => {
  // Large test implementation
});
```

### **Mock Data**
```typescript
import { createMockUser, createMockCreateUserRequest } from '../test/setup';

const mockUser = createMockUser();
const createRequest = createMockCreateUserRequest();
```

### **Test Database**
```typescript
import { getTestDatabase } from '../test/setup';

const testDb = await getTestDatabase();
```

## 🚦 **CI/CD Integration**

### **Pre-Merge (Small + Medium)**
- Runs on every PR
- Must pass before merge
- Fast feedback loop
- High reliability

```bash
npm run test:small    # Run only small tests
npm run test:medium   # Run only medium tests
npm run test:ci       # Run both for CI
```

### **Post-Merge (Large)**
- Runs after merge to main
- Can block deployment if critical
- Tests real external systems
- Longer execution time

```bash
npm run test:large    # Run E2E tests
npm run test:e2e      # Alternative command
```

## 📊 **Running Tests**

### **Local Development**
```bash
# Run all tests
npm test

# Run by category
npm run test:small
npm run test:medium
npm run test:large

# Run with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### **CI Environment**
```bash
# Pre-merge tests (Small + Medium)
npm run test:ci

# Post-merge tests (Large)
npm run test:e2e
```

## 🎭 **Mocking Strategies**

### **Repository Mocking**
```typescript
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

userService = new UserService(mockUserRepository as any);
```

### **External Service Mocking**
```typescript
import { ExternalServiceMock } from '../test/setup';

const mockService = ExternalServiceMock.alwaysReturnsOk();
const failingService = ExternalServiceMock.alwaysFails('Service unavailable');
```

## 🔍 **Test Naming Conventions**

### **Small Tests**
- Focus on function behavior
- Clear input/output expectations
- Edge case coverage

```typescript
small('CreateUserCodec validates valid user data', () => {});
small('CreateUserCodec rejects invalid email format', () => {});
small('CreateUserCodec handles edge case email formats', () => {});
```

### **Medium Tests**
- Focus on business logic
- Database interaction testing
- Error handling scenarios

```typescript
medium('createUser successfully creates a new user', async () => {});
medium('createUser handles duplicate email constraint violation', async () => {});
medium('getAllUsers returns array of users when users exist', async () => {});
```

### **Large Tests**
- Focus on complete user flows
- Real HTTP endpoints
- Integration scenarios

```typescript
large('complete user CRUD flow through HTTP endpoints', async () => {});
large('handles duplicate email creation gracefully', async () => {});
large('handles concurrent user creation', async () => {});
```

## 🚨 **Best Practices**

### **Do's**
- ✅ Write more Small tests than Medium/Large
- ✅ Use descriptive test names
- ✅ Mock external dependencies in Medium tests
- ✅ Test error scenarios and edge cases
- ✅ Keep tests focused and isolated

### **Don'ts**
- ❌ Don't make Large tests the primary testing strategy
- ❌ Don't test external systems in Small/Medium tests
- ❌ Don't skip error scenario testing
- ❌ Don't make tests dependent on each other
- ❌ Don't use real external APIs in CI

## 📈 **Coverage Goals**

- **Small Tests**: 90%+ coverage of pure functions
- **Medium Tests**: 80%+ coverage of service layer
- **Large Tests**: 60%+ coverage of critical user flows
- **Overall**: 85%+ total coverage

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Small tests taking too long**
   - Check for database calls or external dependencies
   - Ensure pure function testing only

2. **Medium tests failing intermittently**
   - Check mock setup and cleanup
   - Verify database state isolation

3. **Large tests timing out**
   - Increase timeout in test setup
   - Check external service availability
   - Consider if test is truly necessary

### **Debug Commands**
```bash
# Run single test file
npm test -- user.validation.test.ts

# Run with verbose output
npm test -- --verbose

# Run with coverage for specific file
npm test -- --coverage --collectCoverageFrom="src/user/**/*.ts"
```

## 📚 **Additional Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [fp-ts Testing Patterns](https://gcanti.github.io/fp-ts/guides/testing.html)
- [Google Testing Blog](https://testing.googleblog.com/)

---

**Remember**: The goal is to have a fast, reliable test suite that gives developers confidence to ship code quickly while maintaining quality. Small tests should be your bread and butter, Medium tests for integration, and Large tests only when absolutely necessary.

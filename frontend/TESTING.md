# 🧪 **Frontend Testing - Three-Tier Testing Strategy**

## 🎯 **Overview**

The frontend follows the same **Three-Tier Testing Strategy** as the backend, providing a fast, reliable test suite that gives developers confidence to ship code quickly while maintaining quality.

## 🏗️ **Test Structure**

The project follows a clear test organization:

```
src/
├── test/
│   └── setup.ts                    # Test utilities and categorization
├── types/
│   └── user.validation.test.ts     # Small tests - io-ts validation
├── services/
│   └── (API service tests - planned)  # Medium tests - API service layer
└── components/
    └── (Component integration tests - planned)  # Large tests - Component integration
```

## 📊 **Test Categories**

### **Small Tests** 🚀
- **Purpose**: Fast, reliable tests for pure functions and validation
- **Scope**: No network, no DOM, no external systems
- **Examples**: Type validation, utility functions, data transformations
- **Execution**: < 1 second per test
- **Reliability**: 99.9%+ pass rate

### **Medium Tests** ⚡
- **Purpose**: Integration tests for service layers and API interactions
- **Scope**: Mocked external dependencies, local state management
- **Examples**: API service calls, data fetching, error handling
- **Execution**: 1-5 seconds per test
- **Reliability**: 95%+ pass rate

### **Large Tests** 🌐
- **Purpose**: End-to-end component integration and user interactions
- **Scope**: Full component rendering, user interactions, state management
- **Examples**: Form submissions, user workflows, UI state consistency
- **Execution**: 5-30 seconds per test
- **Reliability**: 90%+ pass rate

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
import { createMockUser, createMockCreateUserRequest, mockApiResponses } from '../test/setup';

const mockUser = createMockUser();
const createRequest = createMockCreateUserRequest();
const apiResponse = mockApiResponses.users;
```

### **Testing Library Setup**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Render component
render(<UserManager />);

// Find elements
const button = screen.getByRole('button', { name: 'Submit' });

// User interactions
const user = userEvent.setup();
await user.click(button);

// Async assertions
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
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
- Tests component integration
- Longer execution time

```bash
npm run test:large    # Run integration tests
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

## 🎭 **Testing Patterns**

### **Component Testing**
```typescript
// Test component rendering
render(<UserForm onSubmit={mockSubmit} />);
expect(screen.getByLabelText('Email:')).toBeInTheDocument();

// Test user interactions
const user = userEvent.setup();
await user.type(emailInput, 'test@example.com');
await user.click(submitButton);

// Test async behavior
await waitFor(() => {
  expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

### **Service Testing**
```typescript
// Mock external dependencies
jest.mock('axios');
const axios = require('axios');

// Test successful API calls
axios.get.mockResolvedValue({ data: mockUsers });
const result = await userApi.getAllUsers();
expect(E.isRight(result)).toBe(true);

// Test error handling
axios.get.mockRejectedValue(new Error('Network error'));
const result = await userApi.getAllUsers();
expect(E.isLeft(result)).toBe(true);
```

### **Type Validation Testing**
```typescript
// Test valid data
const validUser = { email: 'test@example.com', name: 'Test User' };
const result = CreateUserCodec.decode(validUser);
expect(E.isRight(result)).toBe(true);

// Test invalid data
const invalidUser = { email: 'invalid-email' };
const result = CreateUserCodec.decode(invalidUser);
expect(E.isLeft(result)).toBe(true);
```

## 🔧 **Test Configuration**

### **Jest Configuration**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
```

### **Testing Library Setup**
```typescript
import '@testing-library/jest-dom';

// Extends Jest matchers with DOM-specific assertions
expect(element).toBeInTheDocument();
expect(element).toHaveClass('active');
expect(element).toHaveValue('test');
```

## 📈 **Coverage Goals**

### **Small Tests**
- **Target**: 100% coverage
- **Focus**: Pure functions, validation logic
- **Priority**: Highest

### **Medium Tests**
- **Target**: 90%+ coverage
- **Focus**: Service layer, API interactions
- **Priority**: High

### **Large Tests**
- **Target**: 80%+ coverage
- **Focus**: User workflows, component integration
- **Priority**: Medium

## 🚀 **Best Practices**

### **Test Organization**
1. **Group related tests** in describe blocks
2. **Use descriptive test names** that explain the behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests focused** on single responsibility

### **Mocking Strategy**
1. **Mock external dependencies** (APIs, services)
2. **Use realistic mock data** that matches production
3. **Test error scenarios** with appropriate mocks
4. **Avoid over-mocking** internal logic

### **Async Testing**
1. **Use waitFor** for async operations
2. **Test loading states** and error handling
3. **Verify cleanup** after async operations
4. **Handle race conditions** in concurrent operations

## 🎯 **Success Metrics**

- **Fast feedback**: Small tests complete in < 30 seconds
- **High reliability**: 95%+ pass rate in CI
- **Good coverage**: 80%+ overall test coverage
- **Developer confidence**: Tests catch regressions before merge

**Remember**: The goal is to have a fast, reliable test suite that gives developers confidence to ship code quickly while maintaining quality. Small tests should be your bread and butter, Medium tests for integration, and Large tests for user workflows.

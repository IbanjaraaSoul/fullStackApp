# 🚀 Full-Stack Application with React, NestJS, fp-ts, and PostgreSQL

A modern, type-safe full-stack application demonstrating functional programming principles, comprehensive testing, and best practices for building scalable web applications.

## ✨ **Features**

- **Frontend**: React.js with TypeScript, Vite, and fp-ts for functional programming
- **Backend**: NestJS with TypeScript, fp-ts, and PostgreSQL
- **Database**: PostgreSQL with Docker and TypeORM
- **Testing**: Comprehensive test suite following the **Mercury Testing Philosophy**
- **Validation**: Runtime type validation with io-ts
- **Architecture**: Monorepo structure with clear separation of concerns

## 🏗️ **Architecture**

```
fullstackapp/
├── frontend/          # React.js frontend application
├── backend/           # NestJS backend API
├── docker-compose.yml # Database and services
└── package.json       # Monorepo configuration
```

## 🧪 **Mercury Testing Philosophy**

This project implements a comprehensive testing strategy with three test categories:

### **Small Tests** 🚀
- **Purpose**: Fast, isolated unit tests
- **Scope**: Individual functions, validation logic, type checking
- **Target**: < 1 second execution time
- **Examples**: io-ts codec validation, utility functions

### **Medium Tests** ⚡
- **Purpose**: Integration tests with mocked dependencies
- **Scope**: Service layer, API interactions, business logic
- **Target**: < 5 minutes execution time
- **Examples**: Service methods, repository operations

### **Large Tests** 🌐
- **Purpose**: End-to-end workflow testing
- **Scope**: Complete user journeys, database operations
- **Target**: < 15 minutes execution time
- **Examples**: CRUD operations, user workflows

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (via Docker)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/IbanjaraaSoul/fullStackApp.git
   cd fullStackApp
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the database**
   ```bash
   npm run db:setup
   npm run db:migrate
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🧪 **Running Tests**

### **All Tests**
```bash
npm test
```

### **By Category**
```bash
# Small tests (fast unit tests)
npm run test:small

# Medium tests (integration tests)
npm run test:medium

# Large tests (end-to-end tests)
npm run test:large

# CI/CD tests
npm run test:ci
```

### **Frontend Only**
```bash
cd frontend
npm test
```

### **Backend Only**
```bash
cd backend
npm test
```

## 📊 **Test Coverage**

### **Frontend**
- ✅ **Small Tests**: 100% implemented and passing (10/10)
- 🔄 **Medium Tests**: Planned (API service layer)
- 🔄 **Large Tests**: Planned (Component integration)

### **Backend**
- ✅ **Small Tests**: 100% implemented and passing (7/7)
- ✅ **Medium Tests**: 100% implemented and passing (12/12)
- ✅ **Large Tests**: 100% implemented and passing (7/7)

## 🛠️ **Technology Stack**

### **Frontend**
- **Framework**: React.js 18+ with TypeScript
- **Build Tool**: Vite
- **Functional Programming**: fp-ts, io-ts
- **Testing**: Jest, Testing Library, jsdom
- **HTTP Client**: Axios

### **Backend**
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Functional Programming**: fp-ts, io-ts
- **Testing**: Jest, Supertest
- **Validation**: Custom validation pipes with io-ts

### **Infrastructure**
- **Database**: PostgreSQL (Docker)
- **Containerization**: Docker & Docker Compose
- **Package Management**: npm workspaces (monorepo)

## 📁 **Project Structure**

```
fullstackapp/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types and io-ts codecs
│   │   └── test/           # Test utilities and setup
│   ├── jest.config.js      # Jest configuration
│   └── package.json        # Frontend dependencies
├── backend/
│   ├── src/
│   │   ├── user/           # User module (entity, service, controller)
│   │   ├── test/           # Test utilities and setup
│   │   └── main.ts         # Application entry point
│   ├── jest.config.js      # Jest configuration
│   └── package.json        # Backend dependencies
├── docker-compose.yml      # Database and services
├── package.json            # Monorepo configuration
└── README.md               # This file
```

## 🔧 **Development**

### **Adding New Features**
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement feature with tests
3. Ensure all tests pass: `npm test`
4. Submit pull request

### **Running Tests During Development**
```bash
# Watch mode for frontend
cd frontend && npm run test:watch

# Watch mode for backend
cd backend && npm run test:watch

# Coverage report
npm run test:cov
```

## 🚀 **Deployment**

### **Frontend**
- Build: `npm run build --workspace=frontend`
- Deploy the `dist/` folder to your hosting service

### **Backend**
- Build: `npm run build --workspace=backend`
- Deploy the `dist/` folder to your server

### **Database**
- Use the provided Docker Compose configuration
- Configure environment variables for production

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Implement your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## 📚 **Learning Resources**

- [React.js Documentation](https://reactjs.org/)
- [NestJS Documentation](https://nestjs.com/)
- [fp-ts Documentation](https://gcanti.github.io/fp-ts/)
- [io-ts Documentation](https://gcanti.github.io/io-ts/)
- [TypeORM Documentation](https://typeorm.io/)

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🎯 **Roadmap**

- [ ] Add authentication and authorization
- [ ] Implement real-time features with WebSockets
- [ ] Add comprehensive error handling and logging
- [ ] Implement caching strategies
- [ ] Add monitoring and observability
- [ ] Create deployment pipelines

---

**Built with ❤️ using modern web technologies and functional programming principles**

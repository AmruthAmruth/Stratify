<div align="center">

# 🚀 Stratify

### Enterprise-Grade Project Management & Workforce Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

**A production-ready SaaS application with multi-tenancy, real-time features, and comprehensive business logic**

[Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📊 Project Overview

**Stratify** is an enterprise-grade Project Management and Workforce Management System built with modern technologies and architectural best practices. This production-ready SaaS application demonstrates professional-level full-stack development with Clean Architecture principles, real-time communication, and comprehensive business logic.

### 🎯 Overall Assessment: **8.5/10**

> *"An impressive, well-architected project with enterprise-level features and professional implementation that rivals commercial project management tools."*

---

## ✨ Features

### 🏢 Multi-Tenant SaaS Architecture
- **Company Registration** with approval workflow
- **Super Admin** approval system
- Company-level data isolation
- **Custom Theming** per company with dynamic color schemes
- Theme persistence and color extraction from company logos

### 👥 User Management
- **4 User Roles**: Super Admin, Company Admin, Manager, Employee
- **Role-Based Access Control (RBAC)** with protected routes
- Department-based organization structure
- Manager-employee hierarchy management
- Comprehensive employee creation and management

### 📋 Agile Project Management
- **Projects** with department and team assignments
- **Sprints** with planning, active, and completed states
- **Issues** (User Stories & Bugs) with:
  - Story points and size estimation
  - Priority levels (Low, Medium, High)
  - Status tracking (Planned, In Progress, Done, Blocked)
  - Acceptance criteria and estimated hours
- **Tasks & SubTasks** for granular work breakdown
- **Backlog Management** with drag-and-drop
- **Kanban Board** for visual task management
- **Sprint Capacity Calculation** and validation
- **Resource Allocation Forecasting** with employee availability tracking

### 💬 Real-Time Communication
- **Socket.IO** integration for live updates
- **One-on-One Chat** with conversation history
- **Group Chat** with multi-participant support
- **Real-Time Notifications** with read/unread status
- Live event synchronization across multiple clients

### 🎥 Meeting Management
- **Meeting Scheduling** with Zego Cloud video integration
- **Automated Reminders** via cron scheduler
- Meeting notifications to all participants
- Project context integration

### 🏖️ Leave Management
- Leave request submission system
- Multi-level approval workflow
- Leave tracking and quota management
- Department-level leave overview for managers

### 💳 Subscription & Billing
- **Razorpay** payment integration
- Subscription plans with flexible pricing
- Automated payment processing
- Company subscription management

### 🔔 Notifications System
- Real-time notifications via Socket.IO
- Multiple notification types (info, success, warning, error)
- Read/unread status tracking
- Role-based notification delivery

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **OTP verification** for registration and password reset
- Cookie-based session management with httpOnly flag
- **Rate Limiting** (3-tier):
  - API: 100 requests per 15 minutes
  - Auth: 20 requests per 5 minutes
  - Password Reset: 5 requests per hour
- **Helmet.js** security headers
- **CORS** with origin whitelisting

### 📁 File Management
- **Cloudinary** integration for cloud storage
- Profile image uploads for users
- Company logo uploads with automatic processing
- Color extraction from images for theming

---

## 🏗️ Architecture

### Backend Architecture ⭐⭐⭐⭐⭐ (5/5)

**Pattern**: Clean Architecture / Domain-Driven Design (DDD)

```
backend/
├── src/
│   ├── domain/              # Pure business entities (24 entities)
│   │   ├── entities/        # Company, Employee, Project, Sprint, Issue, etc.
│   │   └── repositories/    # Repository interfaces (27 interfaces)
│   ├── application/         # Business logic layer
│   │   ├── use-cases/       # 113+ individual use cases
│   │   ├── dtos/            # Data Transfer Objects
│   │   ├── validators/      # Zod validation schemas
│   │   └── mappers/         # DTO ↔ Entity conversion
│   ├── infrastructure/      # External services & implementations
│   │   ├── repositories/    # Repository implementations
│   │   ├── database/        # MongoDB models
│   │   └── services/        # External service integrations
│   ├── interfaces/          # API layer
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   └── middleware/      # Authentication, validation, error handling
│   └── di/                  # Dependency Injection containers
```

#### Key Architectural Highlights:
- ✅ **Dependency Injection** with DI containers
- ✅ **Interface-based design** for testability
- ✅ **Repository Pattern** with domain interfaces
- ✅ **Use Case Pattern** following Single Responsibility Principle
- ✅ **Mapper Pattern** for clean data transformation
- ✅ **Validation Layer** with Zod schemas
- ✅ **Clear separation** between business logic and infrastructure

### Frontend Architecture ⭐⭐⭐⭐ (4/5)

**Pattern**: Feature-based architecture with centralized state management

```
frontend/
├── src/
│   ├── features/            # Feature-based modules
│   │   ├── auth/            # Authentication flows
│   │   ├── company/         # Company admin features
│   │   ├── manager/         # Manager-specific features
│   │   ├── employee/        # Employee-specific features
│   │   ├── general/         # Public pages
│   │   └── superAdmin/      # Super admin features
│   ├── shared/              # Shared components (17 categories)
│   │   ├── Table/           # Reusable table with pagination
│   │   ├── Forms/           # Dynamic form components
│   │   ├── KanbanBoard/     # Drag-and-drop kanban
│   │   ├── Chart/           # Chart.js integration
│   │   ├── Chat/            # Real-time chat components
│   │   └── ...              # Loading, Modal, Notification, etc.
│   ├── store/               # Redux state management
│   │   └── slices/          # 5 Redux slices
│   ├── routes/              # Role-based routing
│   └── utils/               # Helper functions
```

#### State Management:
- **authSlice** - Authentication state (persisted)
- **themeSlice** - Custom theming (persisted)
- **notificationSlice** - Real-time notifications
- **chatSlice** - Chat state management
- **groupChatSlice** - Group chat state

---

## 🛠️ Tech Stack

### Backend Stack ⭐⭐⭐⭐⭐ (5/5)

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js with TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose |
| **Real-time** | Socket.IO |
| **Authentication** | JWT + bcryptjs |
| **Validation** | Zod |
| **File Upload** | Multer + Cloudinary |
| **Email** | Nodemailer |
| **Payments** | Razorpay |
| **Video** | Zego Cloud |
| **Logging** | Winston + Morgan |
| **Scheduling** | Node-cron |
| **Security** | Helmet + CORS + Rate Limiting |

### Frontend Stack ⭐⭐⭐⭐⭐ (5/5)

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript |
| **State Management** | Redux Toolkit + Redux Persist |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS + DaisyUI |
| **Forms** | React Hook Form + Zod |
| **HTTP Client** | Axios |
| **Real-time** | Socket.IO Client |
| **Charts** | Chart.js + React-Chartjs-2 |
| **Animations** | Framer Motion |
| **Notifications** | Notistack + React Hot Toast |
| **Drag & Drop** | @dnd-kit |
| **Date Handling** | date-fns + React DatePicker |
| **Build Tool** | Vite |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/stratify.git
cd stratify
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Environment Configuration

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Zego Cloud
ZEGO_APP_ID=your_zego_app_id
ZEGO_SERVER_SECRET=your_zego_secret

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

#### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📈 Scalability Roadmap

### Phase 1: Current State (Handles ~1,000 users)
- Single server deployment
- MongoDB single instance
- Socket.IO single instance

### Phase 2: Horizontal Scaling (Handles ~10,000 users)
- Load balancer (Nginx/AWS ALB)
- Multiple API server instances
- Redis for session storage
- Socket.IO Redis adapter
- MongoDB replica set

### Phase 3: Microservices (Handles ~100,000+ users)
- Separate services for:
  - Authentication service
  - Project management service
  - Chat service
  - Notification service
  - Meeting service
- Message queue (RabbitMQ/Kafka)
- API Gateway
- MongoDB sharding

---

## 🔒 Security Features

- ✅ **JWT Authentication** with secure token management
- ✅ **Role-Based Access Control (RBAC)** for 4 user types
- ✅ **Rate Limiting** (3-tier protection)
- ✅ **Helmet.js** security headers
- ✅ **CORS** with origin whitelisting
- ✅ **Input Validation** with Zod schemas
- ✅ **Password Hashing** with bcryptjs
- ✅ **OTP Verification** for sensitive operations
- ✅ **HTTP-only Cookies** for token storage
- ✅ **Centralized Error Handling** with no sensitive data exposure
- ✅ **Request Logging** with Winston & Morgan

---

## 🌟 Key Highlights

### 1. Clean Architecture Implementation
Implemented a production-grade backend using **Clean Architecture** and **Domain-Driven Design** principles, with clear separation between domain, application, infrastructure, and interface layers across **500+ files**.

### 2. Complex Business Logic
Built a comprehensive Agile project management system with **sprint capacity calculation**, **resource allocation forecasting**, and **automated validation** of sprint assignments based on employee availability.

### 3. Real-Time Features
Integrated **Socket.IO** for real-time notifications, one-on-one chat, and group messaging, with proper event handling and state synchronization across multiple clients.

### 4. Multi-Tenancy SaaS
Designed and implemented a **multi-tenant SaaS architecture** with company-level data isolation, custom theming per tenant, and role-based access control for 4 user types.

### 5. Third-Party Integrations
Integrated multiple external services including **Razorpay** for payments, **Cloudinary** for media management, **Zego Cloud** for video meetings, and **Nodemailer** for transactional emails.

### 6. Production-Ready Deployment
Configured production deployment on **AWS EC2** with **Nginx**, implemented health checks, request timeouts, rotating log files, and environment-based configuration.

---

## 📊 Project Statistics

- **Backend Files**: 500+ TypeScript files
- **Domain Entities**: 24 entities
- **Use Cases**: 113+ individual use cases
- **Repository Interfaces**: 27 interfaces
- **Frontend Components**: 17 component categories
- **Redux Slices**: 5 state slices
- **User Roles**: 4 role types
- **Third-Party Integrations**: 7+ services

---

## 🎯 Assessment Breakdown

| Category | Score | Rating |
|----------|-------|--------|
| **Architecture** | 9/10 | ⭐⭐⭐⭐⭐ |
| **Features** | 9/10 | ⭐⭐⭐⭐⭐ |
| **Code Quality** | 8/10 | ⭐⭐⭐⭐ |
| **Security** | 8/10 | ⭐⭐⭐⭐ |
| **Scalability** | 8/10 | ⭐⭐⭐⭐ |
| **UI/UX** | 8/10 | ⭐⭐⭐⭐ |
| **Overall** | **8.5/10** | ⭐⭐⭐⭐⭐ |

---

## 📚 Documentation

### API Documentation
- [API Endpoints](docs/API.md) *(Coming Soon)*
- [Authentication Flow](docs/AUTH.md) *(Coming Soon)*
- [WebSocket Events](docs/WEBSOCKET.md) *(Coming Soon)*

### Architecture Documentation
- [Backend Architecture](docs/BACKEND_ARCHITECTURE.md) *(Coming Soon)*
- [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md) *(Coming Soon)*
- [Database Schema](docs/DATABASE.md) *(Coming Soon)*

### Deployment
- [Deployment Guide](docs/DEPLOYMENT.md) *(Coming Soon)*
- [Environment Variables](docs/ENV_VARIABLES.md) *(Coming Soon)*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Clean Architecture principles by Robert C. Martin
- Domain-Driven Design by Eric Evans
- React and TypeScript communities
- All open-source contributors

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Built with ❤️ using Clean Architecture and Modern Technologies**

</div>
    
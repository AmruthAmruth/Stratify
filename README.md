<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=250&section=header&text=Stratify&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Enterprise-Grade%20B2B%20SaaS%20Platform&descAlignY=51&descAlign=62" alt="Stratify Header" />

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

<br/>

**An enterprise-grade, highly scalable B2B SaaS platform engineered with Clean Architecture, Domain-Driven Design (DDD), and advanced request-scoped data isolation.**

[Features](#-core-features) • [Architecture](#-architecture--system-design) • [Tech Stack](#-tech-stack) • [Setup](#-getting-started) • [Contact](#-author)

</div>

---

## 🚀 Overview

**Stratify** is a production-ready Workforce & Project Management SaaS application. Built to handle heavy multi-tenant workloads, this project bypasses standard MVC paradigms in favor of **Hexagonal Architecture (Ports & Adapters)**. 

The application solves complex distributed system challenges including **Cross-Tenant Data Leakage prevention**, **Real-Time Event Synchronization**, and strictly decoupled **Dependency Injection**, making it a showcase of Senior-level Backend Engineering.

---

## 🧠 Architecture & System Design

### 1. Bulletproof Multi-Tenancy (`AsyncLocalStorage`)
Most multi-tenant applications rely on developers manually passing `companyId` into every database query, leading to high risks of cross-tenant data leaks. 
**Stratify eliminates this risk** by utilizing Node.js's native `async_hooks`. 
- An `AsyncLocalStorage` middleware captures the authenticated tenant context.
- A custom **Mongoose Global Plugin** intercepts every `find`, `aggregate`, and `update` pipeline at the ODM level.
- It forcibly injects a `$match: { companyId }` condition, **mathematically guaranteeing data sandboxing** without developer memory.

### 2. Clean Architecture & Domain-Driven Design
The backend is meticulously layered to ensure the core business logic never couples to external frameworks.
- **Domain Layer:** Pure TypeScript interfaces and entities. Agnostic to Mongoose.
- **Application Layer:** 113+ granular Use-Cases enforcing the Single Responsibility Principle.
- **Infrastructure Layer:** Repositories, Database Models, and Cloudinary/Zego service adapters. Mongoose is restricted exclusively to this layer.
- **Interface Layer:** Express Controllers and API Routers.

### 3. Application-Level Dependency Injection
Manual DI containers (e.g., `CompanyDI.ts`) wire the application dynamically top-down. Controllers and Use Cases expect interface contracts rather than concrete singletons, making the entire database layer mockable for robust unit testing.

---

## ⚡ Core Features

### 🏢 B2B Multi-Tenant Subsystems
- **Dynamic Role-Based Access Control (RBAC):** Strict hierarchy handling (Employee < Manager < Company Admin < Super Admin).
- **Automated Organization Theming:** System automatically extracts primary color palettes from uploaded Company Logos to dynamically theme the tenant's dashboard.

### 📋 Agile Project Management Engine
- **Sprint Capacity Automation:** Mathematical capacity calculation and resource allocation forecasting across departments.
- **Kanban Flow:** Drag-and-drop state machines for Issues (User Stories/Bugs) with Story Point estimations.

### 💬 Real-Time Event Driven Micro-Services
- **Authenticated Sockets:** `io.use()` middleware enforces JWT handshake authorization *before* upgrading connections to prevent rogue events.
- **Live Synchronization:** 1-on-1 Chats, Group messaging, typing indicators, and immediate notification dispatching for leave approvals and task assignments.

### 🛡 Security & Hardening
- **Stateless JWT Authorization:** Application scales horizontally infinitely since sessions are completely stateless.
- **Traffic Shaping:** Global Rate Limiting protects the API boundary layer against brute-force/DDoS.
- **Infrastructure Masking:** Helmet.js headers and unified `AppError` handling pipelines prevent infrastructure fingerprinting.

---

## 🛠️ Tech Stack 

### Backend
- **Core:** Node.js, Express.js, TypeScript
- **Architecture:** Clean Architecture, Hexagonal Design, Dependency Injection
- **Database:** MongoDB, Mongoose (with Custom Plugins)
- **Real-Time & Background:** Socket.io, Node-Cron
- **Security:** `express-rate-limit`, `helmet`, `bcryptjs`, JWT

### Frontend
- **Core:** React 19, TypeScript, Vite
- **State Management:** Redux Toolkit, Redux Persist
- **Styling UI:** Tailwind CSS, DaisyUI, Framer Motion
- **Complex UI:** `@dnd-kit` (Kanban), `Chart.js` (Analytics)

### Integrations 
- **Media:** Cloudinary (Multipart Streaming via Multer)
- **Communications:** Zego Cloud (Video Conferencing), Nodemailer
- **Payments:** Razorpay

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)

### Local Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmruthAmruth/stratify.git
   cd stratify
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables needed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create a .env file (VITE_API_URL=http://localhost:5000, VITE_SOCKET_URL=http://localhost:5000)
   npm run dev
   ```

---

## 👨‍💻 Author

**Amruth Shyju**

- **GitHub:** [@AmruthAmruth](https://github.com/AmruthAmruth)
- **LinkedIn:** [Amruth Shyju](https://www.linkedin.com/in/amruth-shyju/)
- **Email:** amruthshyju@gmail.com

<div align="center">
  <p>If you find this repository impressive, please consider giving it a ⭐!</p>
</div>
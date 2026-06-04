# Smart Inventory Management System (SIMS)

A production-ready full-stack inventory management platform designed to streamline inventory operations, order processing, supplier management, and business analytics. The system provides secure role-based access, real-time inventory tracking, performance optimization through Redis caching, and automated deployment workflows.

---

## Features

### Authentication & Authorization

* JWT-based Authentication
* Role-Based Access Control (Admin, Manager, Staff)
* Secure Password Hashing (bcrypt)

### Inventory Management

* Product & Category Management
* SKU and Barcode Tracking
* Stock Monitoring & Adjustment History
* Low Stock Alerts

### Order & Supplier Management

* Purchase Orders
* Sales Orders
* Order Status Tracking
* Supplier Management

### Dashboard & Analytics

* Inventory Overview
* Product Analytics
* Recent Transactions
* User Activity Logs

### Performance & Scalability

* Redis Caching
* Optimized Database Queries
* RESTful API Architecture
* Scalable Backend Services

### DevOps

* Dockerized Deployment
* Docker Compose Setup
* GitHub Actions CI/CD Pipeline

---

## Technology Stack

| Layer           | Technologies                           |
| --------------- | -------------------------------------- |
| Frontend        | Next.js, React.js, Tailwind CSS        |
| Backend         | Node.js, Express.js                    |
| Database        | MySQL                                  |
| Cache           | Redis                                  |
| Authentication  | JWT, bcrypt                            |
| DevOps          | Docker, Docker Compose, GitHub Actions |
| Version Control | Git, GitHub                            |

---

## Project Structure

```bash
sims/
├── frontend/                 # Next.js Frontend
├── backend/                  # Express.js REST APIs
├── db/                       # Database Schema & Seed Scripts
├── docker-compose.yml
├── .env.example
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Getting Started

### Prerequisites

* Node.js (v18+)
* MySQL 8+
* Redis 7+
* Docker & Docker Compose (Optional)

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/smart-inventory-management-system.git

cd smart-inventory-management-system
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Update the environment variables as required.

---

## Run with Docker

```bash
docker compose up --build
```

### Application URLs

```text
Frontend  : http://localhost:3000
Backend   : http://localhost:5000/api
API Docs  : http://localhost:5000/api/docs
```

---

## Run Locally

### Backend

```bash
cd backend

npm install

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Ensure MySQL and Redis services are running before starting the application.

---

## API Documentation

Swagger Documentation:

```text
GET /api/docs
```

Provides interactive API testing and endpoint documentation.

---

## CI/CD Pipeline

GitHub Actions workflow automatically:

* Installs dependencies
* Runs application checks
* Executes tests
* Builds Docker images
* Validates deployment configuration

Workflow Location:

```bash
.github/workflows/ci.yml
```

---

## Key Highlights

* Full-Stack Enterprise Application
* JWT Authentication & RBAC
* Inventory & Order Management
* Redis Caching Integration
* Dockerized Architecture
* CI/CD Automation
* Scalable REST API Design
* Responsive Modern UI

---

## Future Enhancements

* Multi-Warehouse Inventory Support
* Cloud Deployment (AWS / Azure)
* Email & Notification Services
* Inventory Demand Forecasting
* Advanced Business Analytics

---

## Author

**Anshika Singh**

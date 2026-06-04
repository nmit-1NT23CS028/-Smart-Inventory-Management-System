# Smart Inventory Management System (SIMS)

Production-ready full-stack inventory management application.

## Stack
- **Frontend**: Next.js 14 (App Router) + React 18 + TailwindCSS
- **Backend**: Node.js + Express.js (REST API)
- **Database**: MySQL 8
- **Cache/Sessions**: Redis 7
- **Auth**: JWT + bcrypt
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD

## Features
- JWT auth with Role-Based Access Control (Admin / Manager / Staff)
- Dashboard: inventory overview, low-stock alerts, analytics, recent transactions, activity logs
- Inventory: products, categories, SKU, barcode, stock tracking, adjustment history
- Orders: purchase orders, sales orders, status tracking
- Suppliers management
- User management with role assignment
- Redis caching for products & analytics
- Dark/Light mode, responsive sidebar UI
- Swagger API docs at `/api/docs`

## Folder Structure
```
sims/
├── backend/        # Express REST API
├── frontend/       # Next.js app
├── db/             # SQL schema + seeds
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Quick Start (Docker)
```bash
cp .env.example .env
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend:  http://localhost:5000/api
- API Docs: http://localhost:5000/api/docs

## Default Seed Users
| Role    | Email                | Password   |
|---------|----------------------|------------|
| Admin   | admin@sims.local     | Admin@123  |
| Manager | manager@sims.local   | Manager@123|
| Staff   | staff@sims.local     | Staff@123  |

## Local Dev (no Docker)
```bash
# backend
cd backend && npm install && npm run dev
# frontend
cd frontend && npm install && npm run dev
```
Ensure MySQL + Redis are running and `.env` is set.

## API Documentation
Interactive Swagger UI: `GET /api/docs`

## CI/CD
GitHub Actions workflow at `.github/workflows/ci.yml` runs lint, tests, and builds Docker images on every push.

## License
MIT

# TechMarket (MERN E-Commerce)

TechMarket is a MERN-stack e-commerce platform scaffolded from the SRS requirements with:

- JWT-based authentication and role authorization
- Product browsing with search/filter/sort/pagination
- Cart persistence (guest local storage + user DB merge)
- Order creation and history
- Review and rating system
- Admin metrics and management endpoints

## Project Structure

- `backend` Express + MongoDB API
- `frontend` React + Vite SPA

## Quick Start

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`
Backend default URL: `http://localhost:5000`

## Implemented API Base

All endpoints are under `/api/v1`.

- Auth: `/auth/*`
- Products: `/products`
- Cart: `/cart`
- Orders: `/orders`
- Reviews: `/reviews`
- Admin: `/admin`

## Notes

- Set a strong `JWT_SECRET` (32+ characters) in backend `.env`.
- Configure `MONGO_URI` before running backend.
- Email sending is optional and only enabled when SMTP env vars are set.

# SkillSwap — Freelance Micro-Task Platform

Live Demo: https://skill-swap-client-a10.vercel.app

## Project Overview
SkillSwap is a freelance micro-task marketplace built to match clients with freelancers for quick, one-time jobs. Clients can post tasks, review proposals, pay securely with Stripe Checkout, and mark work complete. Freelancers can browse tasks, submit proposals, and track earnings. Admins can manage users, tasks, and transactions.

This repository contains two parts:
- `task-hive-client/` — Next.js frontend app
- `task-hive-server/` — Express API server with MongoDB backend

## Key Features
- Role-based access: Client, Freelancer, Admin
- BetterAuth authentication with credentials and Google OAuth
- Stripe payment flow with checkout success page
- Responsive UI for mobile, tablet, and desktop
- Public pages: home, browse tasks, browse freelancers, task details, freelancer profile, login, register, custom 404
- Private dashboards:
  - Client: Post Task, My Tasks, Proposals, Payments
  - Freelancer: Browse Tasks, My Proposals, Earnings, Profile
  - Admin: Manage Users, Manage Tasks, Transactions
- Dynamic home page sections with real data from MongoDB
- Error handling on forms, API endpoints, and route refreshes
- CORS-safe API configuration for deployed frontend/backend

## Assignment Requirements Covered
- Frontend and backend separated into distinct folders
- Environment variables stored in `.env.local` and `.env` files
- MongoDB credentials and auth secrets kept out of source code
- Fully responsive layout and professional UX
- Routing and refresh-safe private pages
- Real data loading for latest tasks and top freelancers
- Admin analytics and role-specific protected routes

## Tech Stack
- Frontend: Next.js 16, React 19, Tailwind CSS, BetterAuth, Stripe.js, React Icons, React Toastify
- Backend: Node.js, Express 5, MongoDB 7, dotenv, cookie-parser
- Database: MongoDB Atlas
- Deployment: Vercel for frontend (live link above)

## Frontend Packages
- `next`
- `react`
- `react-dom`
- `better-auth`
- `@better-auth/mongo-adapter`
- `@stripe/stripe-js`
- `stripe`
- `react-icons`
- `react-toastify`
- `tailwindcss`
- `@heroui/react`
- `@heroui/styles`

## Backend Packages
- `express`
- `mongodb`
- `dotenv`
- `cookie-parser`
- `nodemon` (dev)

## Setup Instructions
1. Clone the repository.
2. Install frontend dependencies:
   ```bash
   cd task-hive-client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../task-hive-server
   npm install
   ```
4. Configure environment variables:
   - Frontend: `task-hive-client/.env.local`
   - Backend: `task-hive-server/.env`
5. Start the backend server:
   ```bash
   cd task-hive-server
   npm run dev
   ```
6. Start the frontend app:
   ```bash
   cd ../task-hive-client
   npm run dev
   ```
7. Open the app at `http://localhost:3000`.

## Environment Variables
### Frontend (`task-hive-client/.env.local`)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `MONGO_DB_URI`
- `AUTH_DB_NAME`
- `GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `GOOGLE_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

### Backend (`task-hive-server/.env`)
- `MONGO_DB_URI`
- `AUTH_DB_NAME`
- `APP_DB_NAME`
- `BETTER_AUTH_SECRET`
- `CLIENT_URL`
- `PORT`

## Useful URLs
- Home: `/`
- Browse Tasks: `/browse-tasks`
- Browse Freelancers: `/browse-freelancers`
- Task Details: `/task/[id]`
- Freelancer Profile: `/freelancers/[id]`
- Client Dashboard: `/dashboard/client`
- Freelancer Dashboard: `/dashboard/freelancer`
- Admin Dashboard: `/dashboard/admin`
- Payment Success: `/payment/success`

## Test Accounts
- Admin: `admin1@taskhive.com` / `admin1@taskhive.com`
- Freelancer: `freelanceruser3@gmail.com` / `freelanceruser3@gmail.com`

## Notes
- The live frontend is deployed at `https://skill-swap-client-a10.vercel.app`.
- The project is designed to avoid page crashes on refresh and preserve auth state during private routes.
- Keep all secret keys out of version control.

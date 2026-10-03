# NovaMart — Portfolio Positioning

## Assignment alignment

CodeAlpha Task 1 asks for a basic e-commerce site with product listings, a cart, product details, order processing, user registration/login, and database storage for products, users and orders. NovaMart implements those requirements with a modern React interface, Express REST API, Prisma and Neon PostgreSQL.

## What makes this portfolio-ready

- Clear product architecture instead of one giant component
- Responsive layout designed for phone, tablet and desktop
- Real database persistence
- Server-side price and inventory calculation during checkout
- Password hashing and JWT authentication
- Role-based admin endpoints
- Order transaction that decrements inventory and creates order records together
- Production-oriented environment variables
- Vercel-compatible Express backend
- Seed data for a fast demo
- Admin fulfillment dashboard
- PWA-style install metadata

## What not to claim in interviews

The payment methods labelled `UPI (demo)` and `Card (demo)` are intentionally simulation-only. No real payment gateway is integrated in this version, and no card information is collected.

## Suggested resume bullets

- Built a responsive full-stack e-commerce platform using React, Node.js, Express, Prisma and PostgreSQL (Neon), covering product discovery, authentication, cart, checkout and order history.
- Implemented JWT-based authentication, bcrypt password hashing and role-based authorization for customer and administrator workflows.
- Designed a transactional order workflow that validates live inventory, computes totals server-side, persists order items and decrements product stock atomically.
- Deployed the frontend and serverless Express backend on Vercel with a managed Neon PostgreSQL database and environment-based production configuration.

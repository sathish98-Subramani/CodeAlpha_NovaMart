# NovaMart — Windows Deployment Guide

This project is intentionally split into two Vercel projects:

- `novamart-frontend` → Vercel frontend
- `novamart-backend` → Vercel Express backend
- Neon PostgreSQL → database

Vercel currently supports Express directly as a Vercel Function and can detect an exported Express app from recognized entry points such as `src/app.js` and `src/server.js`. This repository exports the app from `backend/src/app.js` and keeps `server.js` only for local `app.listen()` development. See Vercel's current Express deployment documentation for the platform behavior.

## A. Install everything on Windows

Install Node.js 20+ and Git.

Verify in Command Prompt:

```bat
node --version
npm --version
git --version
```

## B. Create Neon database

1. Sign in to Neon.
2. Create a PostgreSQL project.
3. Copy the connection string from the Neon connection details.
4. Keep the connection string private.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
```

## C. Prepare the backend locally

```bat
cd C:\Users\YOUR_NAME\Downloads\CodeAlpha_Premium_Ecommerce_Store\backend
npm install
copy .env.example .env
```

Open `.env` and set the Neon URL and a strong JWT secret.

Example:

```env
DATABASE_URL="YOUR_NEON_URL"
JWT_SECRET="a-long-random-secret-you-create"
JWT_EXPIRES_IN="7d"
CLIENT_ORIGIN="http://localhost:5173"
PORT=5000
```

Then:

```bat
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Test:

```text
http://localhost:5000/api/health
```

You should see JSON containing `ok: true`.

## D. Prepare the frontend locally

Open a second Command Prompt:

```bat
cd C:\Users\YOUR_NAME\Downloads\CodeAlpha_Premium_Ecommerce_Store\frontend
npm install
copy .env.example .env
```

Set:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bat
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## E. Push the project to GitHub

From the project root:

```bat
cd C:\Users\YOUR_NAME\Downloads\CodeAlpha_Premium_Ecommerce_Store
git init
git add .
git commit -m "Build premium NovaMart e-commerce platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CodeAlpha_NovaMart.git
git push -u origin main
```

Do NOT add `.env` files to Git. The repository already ignores them.

## F. Deploy backend to Vercel

1. Open Vercel and choose **Add New Project**.
2. Import the GitHub repository.
3. Set **Root Directory** to `backend`.
4. Vercel should detect the Express backend automatically.
5. Add these Environment Variables:

```text
DATABASE_URL = your Neon connection string
JWT_SECRET = your long random secret
JWT_EXPIRES_IN = 7d
CLIENT_ORIGIN = your future frontend URL
```

6. Deploy.
7. Copy the resulting backend URL.

Test:

```text
https://YOUR-BACKEND.vercel.app/api/health
```

## G. Deploy frontend to Vercel

1. Create another Vercel project from the same GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Vercel detects Vite.
4. Add:

```text
VITE_API_URL = https://YOUR-BACKEND.vercel.app/api
```

5. Deploy.
6. Copy the frontend URL.

## H. Connect CORS after frontend deployment

Go back to the Vercel backend project and change:

```text
CLIENT_ORIGIN=https://YOUR-FRONTEND.vercel.app
```

Then redeploy the backend.

For a custom domain, use the exact HTTPS origin, for example:

```text
CLIENT_ORIGIN=https://shop.example.com
```

## I. Production database seed

The easiest approach is to run Prisma against Neon once from your Windows machine:

```bat
cd C:\Users\YOUR_NAME\Downloads\CodeAlpha_Premium_Ecommerce_Store\backend
npm install
```

Put the production Neon URL into `.env`, then:

```bat
npx prisma generate
npx prisma db push
npm run db:seed
```

After seeding, remove the production database URL from the local `.env` if you do not need it there.

## J. Demo admin account

The seed creates:

```text
Email: admin@novamart.demo
Password: Admin@12345
```

Use it only for the demo. Change the credential strategy before treating the store as a real commercial application.

## K. Final verification checklist

Frontend:
- Home page loads
- Shop search works
- Category filters work
- Product details open
- Cart persists after refresh
- Registration works
- Login works
- Checkout requires login
- Order appears in order history
- Admin dashboard opens for the admin

Backend:
- `/api/health` returns success
- `/api/products` returns products
- Login returns a token
- Authenticated `/api/orders/mine` works
- Admin order status update works

Database:
- Users exist
- Products exist
- Orders exist after checkout
- Order items exist
- Product stock decreases after an order

Mobile:
- Test at a narrow phone width
- Test tablet width
- Test desktop width
- Test navigation and checkout on touch

## Vercel project settings summary

Frontend:
```text
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
Environment Variable: VITE_API_URL
```

Backend:
```text
Root Directory: backend
Framework: Express (detected)
Environment Variables: DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_ORIGIN
```

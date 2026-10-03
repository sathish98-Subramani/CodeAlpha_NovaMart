# Backend

The Express application is exported from `app.js` and is intentionally separate from `server.js` so Vercel can detect the Express app as a serverless function while local development still uses `server.js` and `app.listen()`.

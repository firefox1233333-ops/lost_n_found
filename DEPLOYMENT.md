# Lost & Found MERN Deployment Guide (Free Hosting)

This guide deploys your project using:
- **MongoDB Atlas** (database)
- **Render** (backend API)
- **Vercel** (frontend React app)

It also covers:
- **CORS setup with `FRONTEND_URL`** (as you requested)
- **Fix for Vercel refresh/back/forward `404 NOT_FOUND`**

---

## 1) Prerequisites

- GitHub repository with your latest code pushed.
- Accounts: [MongoDB Atlas](https://www.mongodb.com/atlas), [Render](https://render.com), [Vercel](https://vercel.com).
- Your project structure:
  - `server/` = backend
  - `client/` = frontend

---

## 2) MongoDB Atlas Setup

1. Create a free cluster in Atlas.
2. Create a database user (username/password).
3. In **Network Access**, allow your Render IP access:
   - Quick start: add `0.0.0.0/0` (open to all IPs).
   - Later, you can tighten this for security.
4. Get connection string from **Connect > Drivers**.
5. Replace placeholder values and save as your Render `MONGO_URI`.

Example:
`mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/lostfound?retryWrites=true&w=majority&appName=Cluster0`

---

## 3) Backend Deployment on Render

### 3.1 Create Web Service

1. Go to Render -> **New +** -> **Web Service**.
2. Connect your GitHub repo.
3. Configure:
   - **Name**: `lostfound-api` (or your choice)
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3.2 Environment Variables (Render -> Environment)

Set these:

- `MONGO_URI` = your Atlas connection string
- `JWT_SECRET` = long random secret (example: 32+ chars)
- `FRONTEND_URL` = your Vercel frontend URL  
  Example: `https://your-app.vercel.app`

Optional:
- `NODE_ENV` = `production`

### 3.3 CORS (already configured in your backend)

Your backend now uses:

```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

This means for production, you only update `FRONTEND_URL` in Render (no code change needed).

### 3.4 Verify backend

After deploy, open:
- `https://<your-render-service>.onrender.com/`

Expected response:
- `{ "message": "API is running" }`

Keep this backend base URL for Vercel env:
- `https://<your-render-service>.onrender.com/api`

---

## 4) Frontend Deployment on Vercel

### 4.1 Import project

1. Vercel -> **Add New...** -> **Project** -> import your GitHub repo.
2. During setup:
   - **Root Directory**: `client`
   - Framework should detect **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`

### 4.2 Environment Variables (Vercel -> Project Settings -> Environment Variables)

Add:
- `VITE_API_URL` = your Render API URL with `/api`
  - Example: `https://lostfound-api.onrender.com/api`

### 4.3 Fix for refresh/back/forward 404

Your project now includes `client/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is required for React Router SPA routes like:
- `/items`
- `/items/:id`
- `/admin`
- `/security`

Without this, direct visits/refresh on nested routes show:
- `404: NOT_FOUND`

### 4.4 Deploy

Click deploy. After success, note your frontend URL:
- `https://<your-app>.vercel.app`

---

## 5) Connect Frontend + Backend (Important Order)

1. Deploy backend on Render first.
2. Set `VITE_API_URL` in Vercel to Render API URL.
3. Deploy frontend on Vercel and get frontend URL.
4. Set Render `FRONTEND_URL` to Vercel frontend URL.
5. Redeploy Render service (or trigger restart).

This avoids CORS mismatch.

---

## 6) Local vs Production ENV Summary

### Local (`server/.env`)
- `PORT=5000`
- `MONGO_URI=<local or atlas uri>`
- `JWT_SECRET=<secret>`
- `FRONTEND_URL=http://localhost:5173`

### Render (Production env vars)
- `MONGO_URI=<atlas uri>`
- `JWT_SECRET=<secret>`
- `FRONTEND_URL=https://<your-app>.vercel.app`

### Vercel (Production env vars)
- `VITE_API_URL=https://<your-render-service>.onrender.com/api`

---

## 7) Quick Troubleshooting

### A) CORS error in browser console

Check:
1. Render `FRONTEND_URL` exactly matches Vercel URL (including `https`).
2. No trailing slash mismatch (use `https://app.vercel.app` not `https://app.vercel.app/`).
3. Backend has redeployed after env changes.

### B) `404 NOT_FOUND` on refresh route

Check:
1. `client/vercel.json` exists and is pushed.
2. Vercel project root directory is `client`.
3. Redeploy frontend.

### C) Frontend can open, but API calls fail

Check:
1. `VITE_API_URL` is set on Vercel and includes `/api`.
2. Render service is live and responds at `/`.
3. Atlas network access allows Render.
4. `MONGO_URI` and `JWT_SECRET` exist on Render.

### D) Render sleeps on free tier

The first request after idle can be slow (cold start). This is normal on free plans.

---

## 8) Security Checklist (Do this now)

- Rotate any exposed credentials (especially DB password/JWT if shared accidentally).
- Do not commit real `.env` secrets to GitHub.
- Use strong `JWT_SECRET`.
- Keep Atlas DB user privileges minimal.

---

## 9) Deployment Checklist (Short)

- [ ] Atlas cluster + DB user + network access configured
- [ ] Render backend deployed from `server/`
- [ ] Render env vars: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`
- [ ] Vercel frontend deployed from `client/`
- [ ] Vercel env var: `VITE_API_URL`
- [ ] `client/vercel.json` rewrite active
- [ ] Login/register/items pages tested in production
- [ ] Role routes tested (`/admin`, `/security`, `/my-reports`)


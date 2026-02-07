# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key_here
PORT=5000
```

### Step 2: Seed Sample Data (Recommended)
```bash
cd server
npm run seed
```

This creates:
- Admin: `admin@college.edu` / `admin123`
- User: `john@college.edu` / `user123`
- User: `jane@college.edu` / `user123`
- 6 sample items

### Step 3: Start Backend
```bash
cd server
npm run dev
```
✅ Server runs on `http://localhost:5000`

### Step 4: Frontend Setup
```bash
cd client
npm install
```

### Step 5: Start Frontend
```bash
cd client
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### Step 6: Open Browser
Navigate to `http://localhost:5173`

## 🎯 Demo Flow

1. **Login** as admin: `admin@college.edu` / `admin123`
2. **Browse Items** - See sample lost/found items
3. **Report Lost** - Create a new lost item
4. **Report Found** - Create a new found item
5. **Admin Dashboard** - Update status, delete items
6. **Search & Filter** - Try different filters

## 📝 Notes

- Make sure MongoDB is running (local or Atlas)
- Both servers must be running simultaneously
- Admin access is available through frontend for easy demo
- All features are functional and ready for evaluation

## 🐛 Troubleshooting

**Backend won't start?**
- Check `.env` file exists with correct `MONGO_URI` and `JWT_SECRET`
- Ensure MongoDB is accessible

**Frontend can't connect?**
- Verify backend is running on port 5000
- Check browser console for errors

**Can't login?**
- Run seed script: `cd server && npm run seed`
- Or register a new account


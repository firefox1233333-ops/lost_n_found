# Troubleshooting Guide

## Backend Server Not Running (ERR_CONNECTION_REFUSED)

### Problem
You see errors like:
- `Failed to load resource: net::ERR_CONNECTION_REFUSED`
- `Cannot connect to server`
- Cannot register/login

### Solution

**Step 1: Open a new terminal/command prompt**

**Step 2: Navigate to server directory**
```bash
cd server
```

**Step 3: Check your `.env` file**
Make sure `server/.env` exists and has:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
```

⚠️ **IMPORTANT**: Make sure it's `JWT_SECRET` (not `JWT_SECRECT`)

**Step 4: Start the backend server**
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

**Step 5: Keep this terminal open** - The server must keep running!

**Step 6: In a separate terminal, start the frontend**
```bash
cd client
npm run dev
```

### Quick Check

1. **Is the backend running?**
   - Open browser: `http://localhost:5000`
   - Should see: `{"message":"API is running"}`

2. **Is MongoDB connected?**
   - Check the terminal where backend is running
   - Should see: `MongoDB Connected: ...`

3. **Is the frontend running?**
   - Should be on `http://localhost:5173` (or similar)

## Common Issues

### Issue: "JWT_SECRET is not set"
**Fix**: Add `JWT_SECRET=your_secret_here` to `server/.env`

### Issue: "MONGO_URI is not set"
**Fix**: Add your MongoDB connection string to `server/.env`

### Issue: "Port 5000 already in use"
**Fix**: 
- Change `PORT=5001` in `.env`, OR
- Kill the process using port 5000

### Issue: Cannot register as admin
**Fix**: 
1. Make sure backend is running
2. In the register form, select "Admin" from the Role dropdown
3. Fill in all fields and submit

## Testing the Connection

Once both servers are running:

1. **Test Backend**: Visit `http://localhost:5000` - should show JSON
2. **Test Frontend**: Visit `http://localhost:5173` - should show home page
3. **Test Registration**: 
   - Go to Register page
   - Select "Admin" role
   - Fill form and submit
   - Should redirect to items page

## Still Having Issues?

1. Check both terminals for error messages
2. Verify `.env` file exists and has correct values
3. Make sure MongoDB is accessible (if using Atlas, check network access)
4. Try restarting both servers


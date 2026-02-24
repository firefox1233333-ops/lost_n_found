# 🚀 How to Start Your Server

## ⚠️ IMPORTANT: Fix .env File First!

**Your `.env` file has a typo!**

1. Open `server/.env` in your editor
2. Change line 3 from:
   ```
   JWT_SECRECT=aaronjsanthosh
   ```
   To:
   ```
   JWT_SECRET=aaronjsanthosh
   ```
   (Remove the extra 'C' - it should be SECRET, not SECRECT)

3. Save the file

## Step-by-Step: Start Backend Server

### Option 1: Using Terminal/Command Prompt

1. **Open a NEW terminal/command prompt window**
   - Keep this window open - the server needs to keep running!

2. **Navigate to server folder:**
   ```bash
   cd server
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **You should see:**
   ```
   Server running on port 5000
   MongoDB Connected: ...
   ```

5. **✅ Server is now running!** Keep this terminal open.

### Option 2: Using PowerShell (Windows)

1. Open PowerShell
2. Navigate to project:
   ```powershell
   cd C:\Users\aaron\OneDrive\Documents\Desktop\finalproject\server
   ```
3. Start server:
   ```powershell
   npm run dev
   ```

## Verify Server is Running

1. Open your browser
2. Go to: `http://localhost:5000`
3. You should see: `{"message":"API is running"}`

If you see this, the server is working! ✅

## Now You Can Register

1. Go back to your frontend: `http://localhost:5173`
2. Click "Register"
3. Fill in the form:
   - Name: Your name
   - Email: Your email
   - Password: At least 6 characters
   - **Role: Select "Admin"** from dropdown
4. Click "Register"

You should now be able to register successfully! 🎉

## Troubleshooting

### "Port 5000 already in use"
- Another process is using port 5000
- Change `PORT=5001` in `.env` file
- Or close the other application

### "MONGO_URI is not set"
- Make sure your `.env` file has: `MONGO_URI=your_connection_string`

### "JWT_SECRET is not set"
- Make sure you fixed the typo: `JWT_SECRET` (not `JWT_SECRECT`)

### Still can't connect?
- Make sure the server terminal shows "Server running on port 5000"
- Check that MongoDB is accessible
- Try restarting both frontend and backend


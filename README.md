# Lost & Found Management System

A web-based application for managing lost and found items on a college campus. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Register and login system with role-based access (User/Admin)
- **Report Items**: Users can report lost or found items with details
- **Search & Filter**: Search items by title, description, category, location, type, and status
- **Admin Dashboard**: Admins can view all items, update status (Lost → Found → Returned), and delete items
- **Item Details**: View detailed information about each item including reporter contact info

## Tech Stack

- **Frontend**: React, React Router, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd finalproject
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here_make_it_long_and_random
PORT=5000
```

**Example MongoDB URI:**
- Local: `mongodb://localhost:27017/lostfound`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/lostfound`

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Sample Data (Optional but Recommended)

To populate the database with sample users and items for testing:

```bash
cd server
node scripts/seed.js
```

This will create:
- 3 sample users (1 admin, 2 regular users)
- 6 sample items (lost and found)

**Sample Login Credentials:**
- Admin: `admin@college.edu` / `admin123`
- User: `john@college.edu` / `user123`
- User: `jane@college.edu` / `user123`

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### 6. Access the Application

Open your browser and navigate to:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Project Structure

```
finalproject/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar)
│   │   ├── context/       # React context (AuthContext)
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service functions
│   │   └── App.jsx       # Main app component
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose models (User, Item)
│   ├── routes/           # API routes
│   ├── scripts/          # Seed script
│   ├── server.js         # Entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Items
- `GET /api/items` - Get all items (with optional filters: `?type=lost&status=Lost&category=Documents&search=card`)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (requires auth)
- `PUT /api/items/:id/status` - Update item status (admin only)
- `DELETE /api/items/:id` - Delete item (admin only)

## User Roles

### Regular User
- Register and login
- Report lost items
- Report found items
- Search and view items
- View item details

### Admin
- All user permissions
- Access admin dashboard (`/admin`)
- Update item status
- Delete items

## Demo Workflow

1. **Register/Login**: Create an account or use seed data credentials
2. **Report Lost Item**: Navigate to "Report Lost" and fill in the form
3. **Report Found Item**: Navigate to "Report Found" and fill in the form
4. **Browse Items**: View all items on the main page, use filters to narrow down
5. **View Details**: Click on any item to see full details
6. **Admin Actions** (if logged in as admin):
   - Go to Admin Dashboard
   - Update item status (Lost → Found → Returned)
   - Delete fake or duplicate reports

## Troubleshooting

### Backend won't start
- Check if MongoDB is running and connection string is correct
- Verify `.env` file exists with correct variables
- Check if port 5000 is already in use

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in client `.env` (or defaults to `http://localhost:5000/api`)
- Check browser console for CORS errors

### Authentication issues
- Ensure `JWT_SECRET` is set in server `.env`
- Clear browser localStorage if tokens are corrupted
- Check server logs for error messages

## Notes for Evaluators

- This is a final year project focused on functionality and demonstration
- Admin access is available through frontend for easy demonstration
- Sample data can be seeded using the seed script for quick testing
- All core features are implemented and working

## License

This project is created for educational purposes.


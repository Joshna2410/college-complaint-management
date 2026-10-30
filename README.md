# 🎓 College Complaint Management System (CCMS)

A full-stack MERN web application that allows college students to submit complaints about college facilities and enables administrators to manage, track, and resolve them.

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, React Router v6   |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT + bcryptjs                    |
| HTTP       | Axios                             |
| Styling    | Vanilla CSS (custom design system)|

---

## 📁 Project Structure

```
college-complaint-management/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login
│   │   └── complaintController.js# CRUD + stats
│   ├── middleware/auth.js        # JWT verify + role guard
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Complaint.js          # Complaint schema
│   ├── routes/
│   │   ├── auth.js               # /api/auth/*
│   │   └── complaints.js         # /api/complaints/*
│   ├── seed.js                   # Creates default admin
│   ├── server.js                 # Express entry point
│   ├── .env                      # Environment variables
│   └── package.json
└── frontend/
    ├── public/favicon.svg
    ├── src/
    │   ├── api/axios.js          # Axios instance
    │   ├── components/           # Navbar, Sidebar, etc.
    │   ├── context/AuthContext.jsx
    │   ├── pages/                # All page components
    │   └── styles/index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ (https://nodejs.org)
- **MongoDB** running locally on port `27017`, OR a MongoDB Atlas URI
- **npm** v9+

---

## 🚀 Installation & Setup

### 1. Clone / navigate to the project

```bash
cd college-complaint-management
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# The .env file is already pre-configured for local development.
# Edit it if you use a different MongoDB URI or want custom admin credentials:
#   MONGO_URI=mongodb://localhost:27017/college_complaints
#   JWT_SECRET=your_super_secret_jwt_key
#   ADMIN_EMAIL=admin@college.edu
#   ADMIN_PASSWORD=Admin@123

# Create the admin account (run ONCE)
npm run seed

# Start the backend server
npm run dev
```

✅ Backend will start at **http://localhost:5000**

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend dev server
npm run dev
```

✅ Frontend will start at **http://localhost:5173**

---

## 👥 Default Accounts

### Admin
| Field    | Value               |
|----------|---------------------|
| Email    | admin@college.edu   |
| Password | Admin@123           |
| Role     | admin               |

> Run `npm run seed` in the backend folder to create this account.

### Student
Register a new account at **http://localhost:5173/register**

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint             | Access  | Description        |
|--------|----------------------|---------|--------------------|
| POST   | /api/auth/register   | Public  | Register student   |
| POST   | /api/auth/login      | Public  | Login (any role)   |
| GET    | /api/auth/me         | Private | Get own profile    |

### Complaints
| Method | Endpoint              | Access  | Description                     |
|--------|-----------------------|---------|---------------------------------|
| POST   | /api/complaints       | Student | Submit a new complaint          |
| GET    | /api/complaints/my    | Student | Get own complaints              |
| GET    | /api/complaints/stats | Admin   | Dashboard statistics            |
| GET    | /api/complaints       | Admin   | Get all complaints (filterable) |
| GET    | /api/complaints/:id   | Both    | Get single complaint            |
| PUT    | /api/complaints/:id   | Admin   | Update status / add note        |
| DELETE | /api/complaints/:id   | Both    | Delete complaint                |

---

## 🎨 Features

### Student Portal
- ✅ Register & login with JWT
- ✅ Submit complaints (title, category, location, description)
- ✅ View & filter own complaints
- ✅ Track complaint status in real-time
- ✅ Delete pending complaints
- ✅ View detailed complaint info

### Admin Panel
- ✅ Secure admin login (role-checked)
- ✅ Dashboard with live statistics
- ✅ View all student complaints
- ✅ Search & filter by status / category / keyword
- ✅ Inline status update from the table
- ✅ Full complaint details with admin note
- ✅ Delete inappropriate complaints

---

## 🔒 Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens expire in 7 days
- Role-based route protection on both frontend and backend
- Input validation with express-validator
- CORS restricted to localhost dev ports

---

## 🐛 Troubleshooting

| Problem                   | Solution                                         |
|---------------------------|--------------------------------------------------|
| MongoDB not connecting    | Ensure MongoDB service is running locally        |
| Admin login fails         | Run `npm run seed` in backend first              |
| CORS errors               | Make sure backend is on port 5000                |
| Token expired error       | Log out and log back in                          |
| Port 5173 in use          | Change `port` in `vite.config.js`                |

---

## 📝 Complaint Categories

Classroom · Laboratory · Library · Hostel · Canteen · Washrooms · Infrastructure · Other

## 📊 Complaint Statuses

🟡 **Pending** → 🔵 **In Progress** → 🟢 **Resolved**

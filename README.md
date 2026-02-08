# 🚀 TaskForge: Role-Based Task Management System

A robust full-stack task management application featuring **Role-Based Access Control (RBAC)**, secure **JWT Authentication**, and a modern **React-based Dashboard**. Built for the PixelForge Nexus Internship Assignment.

## ✨ Core Features

### 🔐 Authentication & Security
- **JWT-Based Auth**: Secure authorization using JSON Web Tokens stored in HTTP-only cookies.
- **Password Hashing**: Industry-standard encryption using `bcryptjs`.
- **Role Selection**: Flexible user registration as either `Admin` or `User`.

### 🛡️ Role-Based Access Control (RBAC)
- **Admin Privileges**:
  - Full CRUD control over all tasks.
  - Ability to assign tasks to any registered user.
  - Delete any task from the system.
- **User Privileges**:
  - View only tasks assigned to them.
  - Restricted updates: Only allowed to change the `status` of their own tasks.

### 💻 User Experience
- **Responsive Dashboard**: Elegant and responsive UI built with React 19 and Tailwind CSS.
- **Real-time Feedback**: Dynamic status badges and intuitive task management forms.
- **Clean Architecture**: Separation of concerns between backend controllers, models, and frontend components.

---

## 🛠️ Tech Stack

### **Backend (Node.js/Express)**
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT, bcryptjs, cookie-parser
- **Middleware**: Custom RBAC and Auth middlewares
- **Environment**: Dotenv for secure configuration

### **Frontend (React)**
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Networking**: Axios for API communication
- **State Management**: React Hooks (useState, useEffect)

---

## 📁 Project Structure

```bash
├── Backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection setup
│   │   ├── controllers/    # Business logic (authController, taskController)
│   │   ├── middlewares/    # Security layer (verifyToken, authorizeRole)
│   │   ├── models/         # Data schemas (User, Task)
│   │   ├── routes/         # Express API endpoints
│   │   └── index.js        # Server entry point
│   └── package.json        # Backend dependencies
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/       # Login and Signup views
│   │   │   └── Tasks/      # Task boards and Creation modules
│   │   ├── App.jsx         # Main layout & Routing
│   │   └── main.jsx        # Application bootstrap
│   └── package.json        # Frontend dependencies
```

---

## ⚙️ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ 
- **MongoDB**: Local instance or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd Backend
npm install
# Create .env file with YOUR_MONGODB_URI, JWT_SECRET, PORT=3000
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 📡 API Overview

### **Authentication**
- `POST /api/auth/signup`: Create a new account (`admin` | `user`).
- `POST /api/auth/login`: Authenticate and receive a secure cookie.

### **Tasks**
- `GET /api/tasks`: Retrieve tasks (Admin sees all, User sees assigned).
- `POST /api/tasks`: Create task (**Admin Only**).
- `PATCH /api/tasks/:id`: Update task (Admin: all fields, User: status only).
- `DELETE /api/tasks/:id`: Remove task (**Admin Only**).

---

## 📊 RBAC Permission Matrix

| Action | Admin | User |
| :--- | :---: | :---: |
| Create New Tasks | ✅ | ❌ |
| Assign Tasks to Others | ✅ | ❌ |
| View All Project Tasks | ✅ | ❌ |
| View Assigned Tasks | ✅ | ✅ |
| Update Task Status | ✅ | ✅ |
| Update Task Description/Title | ✅ | ❌ |
| Delete Tasks | ✅ | ❌ |

---

## 👤 Author

**Sambhav Trivedi**
*Full-Stack Development Intern candidate*

# Task Management System

A full-stack task management application with role-based access control (RBAC), built with Node.js/Express backend and React frontend.

## 🚀 Features

- **Authentication**: JWT-based authentication with secure cookie storage
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Task Management**: Full CRUD operations with role-based restrictions
- **Responsive UI**: Modern React frontend with Tailwind CSS

---

## 📁 Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers (auth, tasks)
│   │   ├── middlewares/    # Auth middleware (JWT verification, role authorization)
│   │   ├── models/         # Mongoose schemas (User, Task)
│   │   ├── routes/         # API route definitions
│   │   └── index.js        # Express app entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/       # Login, Signup components
│   │   │   └── Tasks/      # TaskList, CreateTask components
│   │   ├── App.jsx         # Main application
│   │   └── main.jsx        # React entry point
│   └── package.json
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Other**: cookie-parser, cors, dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas connection string)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/signup` | Register a new user | Public |
| POST | `/auth/login` | Login user | Public |

#### POST /auth/signup
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "admin" | "user"
}
```
**Response:** `200 OK`
```json
{
  "user": {
    "_id": "string",
    "username": "string",
    "role": "string"
  }
}
```

#### POST /auth/login
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "admin" | "user"
}
```
**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}
```

---

### Task Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/tasks` | Get all tasks | Admin (all) / User (assigned only) |
| POST | `/tasks` | Create a new task | Admin only |
| PATCH | `/tasks/:id` | Update task | Admin (all fields) / User (status only) |
| DELETE | `/tasks/:id` | Delete a task | Admin only |

#### GET /tasks
**Headers:** Requires JWT cookie
**Response:** `200 OK`
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "status": "pending" | "in-progress" | "completed",
    "assignedTo": { "_id": "string", "username": "string" },
    "createdBy": { "_id": "string", "username": "string" }
  }
]
```

#### POST /tasks (Admin Only)
**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)",
  "assignedToUsername": "string"
}
```

#### PATCH /tasks/:id
**Request Body (Admin):**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "pending" | "in-progress" | "completed",
  "assignedToUsername": "string (optional)"
}
```
**Request Body (User):**
```json
{
  "status": "pending" | "completed"
}
```
> ⚠️ Users can only update the `status` field. Attempting to update other fields returns a 403 error.

#### DELETE /tasks/:id (Admin Only)
**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

---

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Missing or invalid fields |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## 🔐 Role-Based Access Control

| Action | Admin | User |
|--------|-------|------|
| View all tasks | ✅ | ❌ (only assigned) |
| Create tasks | ✅ | ❌ |
| Update any field | ✅ | ❌ (status only) |
| Delete tasks | ✅ | ❌ |

---

## 🖥️ Frontend Features

- **Login/Signup**: Authentication forms with role selection
- **Task List**: View tasks with status badges and update/delete actions
- **Create Task**: Admin-only form to create and assign tasks
- **Role-based UI**: Create Task tab only visible to admins

---

## 📊 Scalability Considerations

As the application grows, here are some ways to handle more users and data:

### 1. Database Indexing
Add indexes to frequently searched fields like `username` and `assignedTo` to speed up queries.

### 2. Caching
Store frequently accessed data (like user sessions or task lists) in memory using tools like Redis to reduce database load.

### 3. Load Balancing
Run multiple copies of the backend server and use a load balancer (like NGINX) to distribute traffic evenly across them.

### 4. Separating Services
Split the application into smaller services (e.g., separate Auth and Task services) so each can be scaled independently.

### 5. Using a CDN
Serve frontend static files (HTML, CSS, JS) through a Content Delivery Network to reduce server load and improve load times for users worldwide.

---

## 📬 Postman Collection

A Postman collection is included for easy API testing:

📁 **Location:** `Backend/docs/Internship Task.postman_collection.json`

### How to Import:
1. Open Postman
2. Click **Import** button
3. Select the JSON file from the `Backend/docs` folder
4. All endpoints will be available for testing

> 💡 **Tip**: Make sure to enable "Send cookies" in Postman settings to maintain authentication across requests.

---

## 📝 License

This project is part of an internship assignment.

---

## 👤 Author

Sambhav Trivedi

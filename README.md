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
  "status": "pending" | "in-progress" | "completed"
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

### 1. Microservices Architecture
- **Auth Service**: Separate authentication service with its own database
- **Task Service**: Independent task management service
- **API Gateway**: Central entry point for routing, rate limiting, and load balancing

### 2. Caching Strategy
- **Redis Integration**: Cache frequently accessed data (user sessions, task lists)
- **Query Caching**: Implement MongoDB query result caching
- **HTTP Caching**: Use ETag and Cache-Control headers for API responses

### 3. Load Balancing
- **Horizontal Scaling**: Run multiple instances behind a load balancer (NGINX, AWS ELB)
- **Containerization**: Docker containers orchestrated with Kubernetes
- **Auto-scaling**: Scale based on CPU/memory usage or request count

### 4. Database Optimization
- **Indexing**: Add indexes on frequently queried fields (username, assignedTo)
- **Sharding**: Distribute data across multiple MongoDB shards
- **Read Replicas**: Use replica sets for read-heavy workloads

### 5. Additional Improvements
- **Message Queues**: RabbitMQ/Kafka for async task processing
- **CDN**: Serve static frontend assets via CloudFront/Cloudflare
- **Monitoring**: Implement APM tools (New Relic, Datadog) for performance tracking

---

## 📬 Postman Collection

Import the following endpoints into Postman for testing:

### Auth
- `POST http://localhost:3000/api/auth/signup`
- `POST http://localhost:3000/api/auth/login`

### Tasks
- `GET http://localhost:3000/api/tasks`
- `POST http://localhost:3000/api/tasks`
- `PATCH http://localhost:3000/api/tasks/:id`
- `DELETE http://localhost:3000/api/tasks/:id`

> 💡 **Tip**: Enable "Credentials" in Postman to send cookies with requests.

---

## 📝 License

This project is part of an internship assignment.

---

## 👤 Author

Sambhav

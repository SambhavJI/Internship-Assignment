import express from "express";
import { getAllTasks, createTask, updateTaskStatus, deleteTask } from "../controllers/taskController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";

const taskRouter = express.Router();

// Get all tasks - Admin sees all, User sees assigned
taskRouter.get("/", verifyToken, authorizeRole("admin", "user"), getAllTasks);

// Create task - Admin only
taskRouter.post("/", verifyToken, authorizeRole("admin"), createTask);

// Update task status - User (assigned only) or Admin
taskRouter.patch("/:id", verifyToken, authorizeRole("admin", "user"), updateTaskStatus);

// Delete task - Admin only
taskRouter.delete("/:id", verifyToken, authorizeRole("admin"), deleteTask);

export default taskRouter;

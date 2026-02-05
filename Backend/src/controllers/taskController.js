import Task from "../models/task.js";
import User from "../models/user.js";

// @desc Get all tasks
// @access Private (Admin sees all, User sees assigned)
const getAllTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find().populate("assignedTo", "username").populate("createdBy", "username");
        } else {
            tasks = await Task.find({ assignedTo: req.user.id }).populate("createdBy", "username");
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create a task
// @access Private (Admin only)
const createTask = async (req, res) => {
    try {
        const { title, description, assignedToUsername } = req.body;

        if (!title || !assignedToUsername) {
            return res.status(400).json({ message: "Title and assignedToUsername are required" });
        }

        const assignedUser = await User.findOne({ username: assignedToUsername });
        if (!assignedUser) {
            return res.status(404).json({ message: "Assigned user not found" });
        }

        const newTask = await Task.create({
            title,
            description,
            assignedTo: assignedUser._id,
            createdBy: req.user.id
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update task status
// @access Private (User can mark as complete, Admin can update anything)
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check permissions
        if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        // If it's a user, they can only update status
        if (req.user.role === "user") {
            if (status) task.status = status;
        } else {
            // Admin can update everything
            const { title, description, assignedToUsername } = req.body;
            if (title) task.title = title;
            if (description) task.description = description;
            if (status) task.status = status;
            if (assignedToUsername) {
                const assignedUser = await User.findOne({ username: assignedToUsername });
                if (assignedUser) task.assignedTo = assignedUser._id;
            }
        }

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a task
// @access Private (Admin only)
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { getAllTasks, createTask, updateTaskStatus, deleteTask };

import Project from "../models/Project.js";
import User from "../models/user.js";

// @desc Get all projects
// @access Private (Admin sees all, Lead/Dev see assigned)
const getAllProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === "admin") {
            projects = await Project.find().populate("team", "username").populate("lead", "username");
        } else {
            // Find projects where the user is either the lead or in the team
            projects = await Project.find({
                $or: [
                    { lead: req.user.id },
                    { team: req.user.id }
                ]
            }).populate("team", "username").populate("lead", "username");
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create a project
// @access Private (Admin only)
const createProject = async (req, res) => {
    try {
        const { name, description, deadline, leadUsername } = req.body;

        if (!name || !leadUsername) {
            return res.status(400).json({ message: "Name and leadUsername are required" });
        }

        const leadUser = await User.findOne({ username: leadUsername });
        if (!leadUser) {
            return res.status(404).json({ message: "Lead user not found" });
        }

        const newProject = await Project.create({
            name,
            description,
            deadline,
            lead: leadUser._id,
            team: [leadUser._id] // Lead is part of the team by default
        });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update project status
// @access Private (Admin or Project Lead)
const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check permissions: Admin or the lead of this project
        if (req.user.role !== "admin" && project.lead.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this project" });
        }

        project.status = status || project.status;
        await project.save();

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Assign team member
// @access Private (Admin or Project Lead)
const assignTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { developerUsername } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (req.user.role !== "admin" && project.lead.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to assign members to this project" });
        }

        const devUser = await User.findOne({ username: developerUsername });
        if (!devUser) {
            return res.status(404).json({ message: "Developer not found" });
        }

        if (!project.team.includes(devUser._id)) {
            project.team.push(devUser._id);
            await project.save();
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a project
// @access Private (Admin only)
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only Admins can delete projects" });
        }

        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { getAllProjects, createProject, updateProjectStatus, assignTeamMember, deleteProject };

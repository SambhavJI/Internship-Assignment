import Document from "../models/Document.js";
import Project from "../models/Project.js";

// @desc Upload a document
// @access Private (Admin and Project Leads)
const uploadDocument = async (req, res) => {
    try {
        const { name, url, projectId } = req.body;

        if (!name || !url || !projectId) {
            return res.status(400).json({ message: "Name, url, and projectId are required" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check permissions: Admin or lead of this project
        if (req.user.role !== "admin" && project.lead.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to upload to this project" });
        }

        const newDoc = await Document.create({
            name,
            url,
            project: projectId,
            uploadedBy: req.user.id
        });

        res.status(201).json(newDoc);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get documents for a project
// @access Private (Anyone assigned to the project)
const getProjectDocuments = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user is in team or lead (Admin sees all)
        if (req.user.role !== "admin" &&
            project.lead.toString() !== req.user.id &&
            !project.team.includes(req.user.id)) {
            return res.status(403).json({ message: "Not authorized to view documents for this project" });
        }

        const documents = await Document.find({ project: projectId }).populate("uploadedBy", "username");
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { uploadDocument, getProjectDocuments };

import express from "express";
import {
    getAllProjects,
    createProject,
    updateProjectStatus,
    assignTeamMember,
    deleteProject
} from "../controllers/projectController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";

const projectRouter = express.Router();

projectRouter.use(verifyToken);

projectRouter.get("/", getAllProjects);
projectRouter.post("/", authorizeRole("admin"), createProject);
projectRouter.patch("/:id/status", authorizeRole("admin", "project_lead"), updateProjectStatus);
projectRouter.patch("/:id/assign", authorizeRole("admin", "project_lead"), assignTeamMember);
projectRouter.delete("/:id", authorizeRole("admin"), deleteProject);

export default projectRouter;

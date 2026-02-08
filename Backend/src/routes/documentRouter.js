import express from "express";
import { uploadDocument, getProjectDocuments } from "../controllers/documentController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";

const documentRouter = express.Router();

documentRouter.use(verifyToken);

documentRouter.post("/", authorizeRole("admin", "project_lead"), uploadDocument);
documentRouter.get("/project/:projectId", getProjectDocuments);

export default documentRouter;

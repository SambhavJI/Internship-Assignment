import express from "express";
import { getAllUsers, updateUserRole, updatePassword } from "../controllers/userController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken);

userRouter.get("/", authorizeRole("admin"), getAllUsers);
userRouter.patch("/:id/role", authorizeRole("admin"), updateUserRole);
userRouter.patch("/profile/password", updatePassword);

export default userRouter;

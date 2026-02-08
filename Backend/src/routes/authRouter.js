import express from 'express';
import { login, signup } from '../controllers/authController.js';
import { verifyToken, authorizeRole } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', verifyToken, authorizeRole('admin'), signup);

export default authRouter;


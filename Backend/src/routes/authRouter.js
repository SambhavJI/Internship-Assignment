import express from 'express';
import { login } from '../controllers/authController.js';
import { signup } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', signup);

export default authRouter;


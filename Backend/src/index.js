import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
dotenv.config();
import authRouter from './routes/authRouter.js';
import projectRouter from './routes/projectRouter.js';
import documentRouter from './routes/documentRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

// CORS configuration for frontend
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/documents', documentRouter);
app.use('/api/users', userRouter);

dbConnect().then(
    () => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server Started at port ${PORT}`);
        })
    }
).catch((err) => {
    console.log("Error in starting the server." + err)
})


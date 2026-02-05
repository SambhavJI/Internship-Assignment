import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
dotenv.config();

async function signup(req, res) {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, role });

    const token = jwt.sign({ id: newUser._id, username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hour
    });

    res.json({ user: newUser });
}

async function login(req, res) {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hour
    });

    res.json({ message: "Login successful" });
}

export { signup, login };
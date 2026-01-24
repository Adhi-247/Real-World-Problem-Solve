//password - TkebXeTKOr4BbTjk

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Import Routes
const helpRequestRoutes = require('./Routes/helpRequestRoutes');
const missingPersonRoutes = require('./Routes/missingPersonRoutes');
const userRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const volunteerRoutes = require('./Routes/volunteerRoutes');

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json({ limit: '50mb' })); // Parse JSON requests with 50mb limit for images
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded requests

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api', helpRequestRoutes);
app.use('/api', missingPersonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Disaster Management API is running...");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

// MongoDB connection with optimized settings
mongoose.connect("mongodb+srv://admin:TkebXeTKOr4BbTjk@cluster1.fm3j61n.mongodb.net/disasterManagement", {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 2,  // Maintain minimum 2 connections
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
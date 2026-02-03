require('dotenv').config();
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
const activeDisasterRoutes = require('./Routes/activeDisasterRoutes');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api', helpRequestRoutes);
app.use('/api', missingPersonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/active-disasters', activeDisasterRoutes);

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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:TkebXeTKOr4BbTjk@cluster1.fm3j61n.mongodb.net/disasterManagement";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
});
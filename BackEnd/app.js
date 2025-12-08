//password - TkebXeTKOr4BbTjk

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Import Routes
const helpRequestRoutes = require('./Routes/helpRequestRoutes');
const missingPersonRoutes = require('./Routes/missingPersonRoutes');

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json({ limit: '50mb' })); // Parse JSON requests with 50mb limit for images
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded requests

// Routes
app.use('/api', helpRequestRoutes);
app.use('/api', missingPersonRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Disaster Management API is running...");
});

mongoose.connect("mongodb+srv://admin:TkebXeTKOr4BbTjk@cluster1.fm3j61n.mongodb.net/disasterManagement")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
})
.catch((err) => console.log(err));
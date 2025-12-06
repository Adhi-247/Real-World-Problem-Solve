//password - TkebXeTKOr4BbTjk

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON requests
app.use("/", (req, res, next) => {
    res.send("API is running...");
})  

mongoose.connect("mongodb+srv://admin:TkebXeTKOr4BbTjk@cluster1.fm3j61n.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log(err));
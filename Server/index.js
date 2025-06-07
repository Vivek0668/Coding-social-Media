const express = require('express');
const cors = require('cors');
const upload = require('express-fileupload');
require("dotenv").config();
const { connect } = require("mongoose");
const routes = require("./routes/routes");
const { notFound, errorHandler } = require('./middlewares/errormiddleware');
const { server, app, io } = require('./socket/socket'); // Ensure io is imported for debugging

// Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
    credentials: true, 
    origin: "http://localhost:5173" // Single origin for simplicity, matches frontend
}));
app.use(upload());

// Routes
app.use('/api', routes);

// Error-handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server
connect(process.env.MONGO_URL)
    .then(() => {
        const port = process.env.PORT || 5000;
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log("Environment variables:", {
                PORT: process.env.PORT,
                MONGO_URL: process.env.MONGO_URL ? "Set" : "Not set",
                Backend_API_URL: process.env.Backend_api_url
            });
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Debug Socket.IO connections
io.on("connection", (socket) => {
    console.log("Socket.IO connection established in index.js:", socket.id);
});

module.exports = app;
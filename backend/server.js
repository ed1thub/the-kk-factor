
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Initialise Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to KK Factor News Portal API",
        status: "success"
    });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend server is running successfully"
    });
});

// Define server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});

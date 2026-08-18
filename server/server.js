import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import {
    redirectUrl
} from "./controllers/urlController.js";

import { errorHandler } from "./middleware/errorHandler.js";

import expireLinks from "./utils/expireLinks.js";

dotenv.config();

const app = express();

// --------------------
// Middleware
// --------------------

app.use(cors());
app.use(express.json());

// --------------------
// API Routes
// --------------------

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "URL Shortener API is running 🚀"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/urls", urlRoutes);

app.use("/api/analytics", analyticsRoutes);

// --------------------
// Short URL Redirect
// --------------------

app.get("/:shortCode", redirectUrl);

// --------------------
// Error Handler
// --------------------

app.use(errorHandler);

// --------------------
// Start Server
// --------------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });

        setInterval(
            expireLinks,
            5 * 60 * 1000
        );

    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
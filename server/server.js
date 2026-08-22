import "dotenv/config";

import express from "express";
import cors from "cors";

import settingsRoutes from "./routes/settingsRoutes.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { redirectUrl } from "./controllers/urlController.js";

import { errorHandler } from "./middleware/errorHandler.js";

import expireLinks from "./utils/expireLinks.js";

const app = express();

// ==============================
// ENVIRONMENT CHECK
// ==============================

console.log(
    "Razorpay Key:",
    process.env.RAZORPAY_KEY_ID
        ? "Loaded"
        : "NOT LOADED"
);

console.log(
    "EMAIL_USER:",
    process.env.EMAIL_USER
        ? "Loaded"
        : "NOT LOADED"
);

console.log(
    "EMAIL_APP_PASSWORD:",
    process.env.EMAIL_APP_PASSWORD
        ? "Loaded"
        : "NOT LOADED"
);

// ==============================
// MIDDLEWARE
// ==============================

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json());

// ==============================
// SETTINGS ROUTES
// ==============================

app.use(
    "/api/settings",
    settingsRoutes
);

// ==============================
// ROOT ROUTE
// ==============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "URL Shortener API is running 🚀",
    });
});

// ==============================
// AUTH ROUTES
// ==============================

app.use(
    "/api/auth",
    authRoutes
);

// ==============================
// URL ROUTES
// ==============================

app.use(
    "/api/urls",
    urlRoutes
);

// ==============================
// ANALYTICS ROUTES
// ==============================

app.use(
    "/api/analytics",
    analyticsRoutes
);

// ==============================
// PAYMENT ROUTES
// ==============================

app.use(
    "/api/payments",
    paymentRoutes
);

// ==============================
// SHORT URL REDIRECT
// ==============================

// IMPORTANT:
// Keep this AFTER all /api routes.

app.get(
    "/:shortCode",
    redirectUrl
);

// ==============================
// ERROR HANDLER
// ==============================

// Must be the LAST middleware.

app.use(errorHandler);

// ==============================
// SERVER
// ==============================

const PORT =
    process.env.PORT || 5000;

const startServer = async () => {

    try {

        // ==========================
        // CONNECT DATABASE
        // ==========================

        await connectDB();

        // ==========================
        // START SERVER
        // ==========================

        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `Server running on port ${PORT}`
                );

            }
        );

        // ==========================
        // EXPIRED LINK CHECKER
        // ==========================

        setInterval(
            expireLinks,
            5 * 60 * 1000
        );

        console.log(
            "Expired-link checker started."
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
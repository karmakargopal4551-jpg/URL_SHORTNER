import express from "express";

import {
    getSettings,
    updateNotifications,
    updatePreferences,
    changePassword,
} from "../controllers/settingsController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// SETTINGS
// ==========================================

// Get settings
router.get(
    "/",
    protect,
    getSettings
);

// Update notification settings
router.put(
    "/notifications",
    protect,
    updateNotifications
);

// Update general preferences
router.put(
    "/preferences",
    protect,
    updatePreferences
);

// Change password
router.put(
    "/password",
    protect,
    changePassword
);

export default router;
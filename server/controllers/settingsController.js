import bcrypt from "bcrypt";
import User from "../models/user.js";

// ==========================================
// GET SETTINGS
// ==========================================

export const getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            settings: {
                notifications:
                    user.settings?.notifications || {
                        emailNotifications: true,
                        linkCreated: true,
                        linkClicked: true,
                        securityAlerts: true,
                    },

                preferences:
                    user.settings?.preferences || {
                        darkMode: false,
                        compactMode: false,
                    },
            },
        });
    } catch (error) {
        console.error(
            "Get settings error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load settings",
        });
    }
};

// ==========================================
// UPDATE NOTIFICATIONS
// ==========================================

export const updateNotifications = async (
    req,
    res
) => {
    try {
        const {
            emailNotifications,
            linkCreated,
            linkClicked,
            securityAlerts,
        } = req.body;

        const user = await User.findById(
            req.user._id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.settings = user.settings || {};

        user.settings.notifications = {
            emailNotifications:
                emailNotifications ??
                user.settings.notifications
                    ?.emailNotifications ??
                true,

            linkCreated:
                linkCreated ??
                user.settings.notifications
                    ?.linkCreated ??
                true,

            linkClicked:
                linkClicked ??
                user.settings.notifications
                    ?.linkClicked ??
                true,

            securityAlerts:
                securityAlerts ??
                user.settings.notifications
                    ?.securityAlerts ??
                true,
        };

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "Notification settings updated",
            notifications:
                user.settings.notifications,
        });
    } catch (error) {
        console.error(
            "Update notifications error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update notification settings",
        });
    }
};

// ==========================================
// UPDATE PREFERENCES
// ==========================================

export const updatePreferences = async (
    req,
    res
) => {
    try {
        const {
            darkMode,
            compactMode,
        } = req.body;

        const user = await User.findById(
            req.user._id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.settings = user.settings || {};

        user.settings.preferences = {
            darkMode:
                darkMode ??
                user.settings.preferences
                    ?.darkMode ??
                false,

            compactMode:
                compactMode ??
                user.settings.preferences
                    ?.compactMode ??
                false,
        };

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "Preferences updated",
            preferences:
                user.settings.preferences,
        });
    } catch (error) {
        console.error(
            "Update preferences error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update preferences",
        });
    }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (
    req,
    res
) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters",
            });
        }

        const user = await User.findById(
            req.user._id
        ).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "Password changed successfully",
        });
    } catch (error) {
        console.error(
            "Change password error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to change password",
        });
    }
};
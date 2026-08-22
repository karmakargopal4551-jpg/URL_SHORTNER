import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        // ==============================
        // EMAIL VERIFICATION
        // ==============================

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        verificationCode: {
            type: String,
            default: null,
            select: false,
        },

        verificationCodeExpires: {
            type: Date,
            default: null,
            select: false,
        },

        subscription: {
            plan: {
                type: String,
                enum: ["free", "pro"],
                default: "free",
            },

            status: {
                type: String,
                enum: [
                    "active",
                    "expired",
                    "cancelled",
                ],
                default: "active",
            },

            expiresAt: {
                type: Date,
                default: null,
            },
        },

        // ==============================
        // SETTINGS
        // ==============================

        settings: {
            notifications: {
                emailNotifications: {
                    type: Boolean,
                    default: true,
                },

                linkCreated: {
                    type: Boolean,
                    default: true,
                },

                linkClicked: {
                    type: Boolean,
                    default: true,
                },

                securityAlerts: {
                    type: Boolean,
                    default: true,
                },
            },

            preferences: {
                darkMode: {
                    type: Boolean,
                    default: false,
                },

                compactMode: {
                    type: Boolean,
                    default: false,
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
            trim: true
        },

        shortCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        customAlias: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        clickCount: {
            type: Number,
            default: 0
        },

        lastClickedAt: {
            type: Date,
            default: null
        },

        expiresAt: {
            type: Date,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Url = mongoose.model("Url", urlSchema);

export default Url;
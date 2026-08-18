import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
    {
        url: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Url",
            required: true
        },

        clickedAt: {
            type: Date,
            default: Date.now
        },

        userAgent: {
            type: String,
            default: null
        },

        referrer: {
            type: String,
            default: null
        },

        ip: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Click = mongoose.model("Click", clickSchema);

export default Click;
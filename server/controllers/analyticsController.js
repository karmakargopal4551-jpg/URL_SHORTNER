import Url from "../models/url.js";
import Click from "../models/click.js";

export const getAnalytics = async (req, res) => {
    try {
        const url = await Url.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "URL not found"
            });
        }

        const clicks = await Click.find({
            url: url._id
        })
            .sort({ clickedAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            analytics: {
                url: {
                    id: url._id,
                    originalUrl: url.originalUrl,
                    shortCode: url.shortCode,
                    shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`
                },

                totalClicks: url.clickCount,

                createdAt: url.createdAt,

                lastClickedAt: url.lastClickedAt,

                expiresAt: url.expiresAt,

                clicks
            }
        });

    } catch (error) {
        console.error("Analytics error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
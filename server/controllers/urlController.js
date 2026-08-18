import Url from "../models/url.js";
import Click from "../models/click.js";
import generateShortCode from "../utils/generateShortCode.js";

// --------------------
// Create Short URL
// --------------------

export const createUrl = async (req, res) => {
    try {
        const {
            originalUrl,
            customAlias,
            expiresAt
        } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                message: "Original URL is required"
            });
        }

        // Validate URL
        try {
            new URL(originalUrl);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid URL"
            });
        }

        // Custom alias validation
        if (customAlias) {
            const aliasRegex = /^[a-zA-Z0-9_-]{3,30}$/;

            if (!aliasRegex.test(customAlias)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Alias must be 3-30 characters and contain only letters, numbers, - or _"
                });
            }

            const existingAlias = await Url.findOne({
                customAlias
            });

            if (existingAlias) {
                return res.status(409).json({
                    success: false,
                    message: "Custom alias already exists"
                });
            }
        }

        // Validate expiration
        if (expiresAt) {
            const expirationDate = new Date(expiresAt);

            if (
                isNaN(expirationDate.getTime()) ||
                expirationDate <= new Date()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Expiration date must be in the future"
                });
            }
        }

        let shortCode = customAlias;

        if (!shortCode) {
            shortCode = generateShortCode();

            let exists = await Url.findOne({ shortCode });

            while (exists) {
                shortCode = generateShortCode();
                exists = await Url.findOne({ shortCode });
            }
        }

        const url = await Url.create({
            originalUrl,
            shortCode,
            customAlias: customAlias || null,
            user: req.user._id,
            expiresAt: expiresAt || null
        });

        res.status(201).json({
            success: true,
            message: "Short URL created successfully",
            url: {
                id: url._id,
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
                clickCount: url.clickCount,
                expiresAt: url.expiresAt,
                createdAt: url.createdAt
            }
        });

    } catch (error) {
        console.error("Create URL error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// --------------------
// Get User URLs
// --------------------

export const getUserUrls = async (req, res) => {
    try {
        const urls = await Url.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: urls.length,
            urls
        });

    } catch (error) {
        console.error("Get URLs error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// --------------------
// Get Single URL
// --------------------

export const getUrl = async (req, res) => {
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

        res.status(200).json({
            success: true,
            url
        });

    } catch (error) {
        console.error("Get URL error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// --------------------
// Delete URL
// --------------------

export const deleteUrl = async (req, res) => {
    try {
        const url = await Url.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "URL not found"
            });
        }

        await Click.deleteMany({
            url: url._id
        });

        res.status(200).json({
            success: true,
            message: "URL deleted successfully"
        });

    } catch (error) {
        console.error("Delete URL error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// --------------------
// Redirect Short URL
// --------------------

export const redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({
            shortCode,
            isActive: true
        });

        if (!url) {
            return res.status(404).send("Short URL not found");
        }

        // Check expiration
        if (
            url.expiresAt &&
            url.expiresAt <= new Date()
        ) {
            url.isActive = false;
            await url.save();

            return res.status(410).send("This short URL has expired");
        }

        // Update statistics
        await Url.findByIdAndUpdate(url._id, {
            $inc: {
                clickCount: 1
            },
            $set: {
                lastClickedAt: new Date()
            }
        });

        // Save click analytics
        await Click.create({
            url: url._id,
            userAgent: req.get("user-agent"),
            referrer: req.get("referer"),
            ip: req.ip
        });

        res.redirect(url.originalUrl);

    } catch (error) {
        console.error("Redirect error:", error);

        res.status(500).send("Server error");
    }
};
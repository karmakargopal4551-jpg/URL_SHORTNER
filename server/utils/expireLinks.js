import Url from "../models/url.js";

const expireLinks = async () => {
    try {
        const result = await Url.updateMany(
            {
                expiresAt: {
                    $ne: null,
                    $lte: new Date()
                },

                isActive: true
            },
            {
                $set: {
                    isActive: false
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(
                `${result.modifiedCount} expired link(s) invalidated`
            );
        }

    } catch (error) {
        console.error(
            "Error expiring links:",
            error.message
        );
    }
};

export default expireLinks;
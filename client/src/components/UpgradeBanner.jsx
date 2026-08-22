import React from "react";

import {
    Sparkles,
    X,
} from "lucide-react";

const UpgradeBanner = ({
    onUpgrade,
}) => {
    return (
        <div className="upgrade-banner">
            <div className="upgrade-banner-icon">
                <Sparkles size={22} />
            </div>

            <div className="upgrade-banner-content">
                <h3>
                    Upgrade to Shortly Pro
                </h3>

                <p>
                    Unlock unlimited links,
                    advanced analytics and an
                    ad-free experience.
                </p>
            </div>

            <button
                className="upgrade-banner-button"
                onClick={onUpgrade}
            >
                <Sparkles size={16} />
                ₹1/month
            </button>

            <button className="upgrade-dismiss">
                <X size={18} />
            </button>
        </div>
    );
};

export default UpgradeBanner;
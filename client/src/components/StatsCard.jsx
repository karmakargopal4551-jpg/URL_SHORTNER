import React from "react";

import {
    Link2,
    MousePointerClick,
    Activity,
    Clock,
} from "lucide-react";

const StatsCard = ({
    title,
    value,
    description,
    icon,
}) => {
    const icons = {
        link: Link2,
        clicks: MousePointerClick,
        active: Activity,
        clock: Clock,
    };

    const Icon =
        icons[icon] || Link2;

    return (
        <div className="stats-card">
            <div className="stats-card-icon">
                <Icon size={21} />
            </div>

            <div>
                <p className="stats-card-title">
                    {title}
                </p>

                <h2>{value}</h2>

                <span>
                    {description}
                </span>
            </div>
        </div>
    );
};

export default StatsCard;
const StatsCard = ({
    icon,
    title,
    value,
    description,
}) => {
    return (
        <div className="stats-card">
            <div className="stats-icon">
                {icon}
            </div>

            <div>
                <p className="stats-title">
                    {title}
                </p>

                <h3>{value}</h3>

                {description && (
                    <span className="stats-description">
                        {description}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
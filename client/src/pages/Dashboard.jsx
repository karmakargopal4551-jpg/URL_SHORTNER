import { useEffect, useState } from "react";

import {
    Link as LinkIcon,
    MousePointerClick,
    Link2,
    Clock3,
} from "lucide-react";

import Navbar from "../components/Navbar";
import UrlForm from "../components/UrlForm";
import UrlCard from "../components/UrlCard";
import StatsCard from "../components/StatsCard";
import Loading from "../components/Loading";

import api from "../services/api";

const Dashboard = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUrls = async () => {
        try {
            setLoading(true);

            const response = await api.get("/urls");

            setUrls(response.data.urls || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load URLs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    const handleCreated = () => {
        fetchUrls();
    };

    const handleDeleted = (id) => {
        setUrls((previous) =>
            previous.filter(
                (url) => url._id !== id
            )
        );
    };

    const totalClicks = urls.reduce(
        (total, url) =>
            total + (url.clickCount || 0),
        0
    );

    const activeLinks = urls.filter(
        (url) => url.isActive
    ).length;

    return (
        <div className="app">
            <Navbar />

            <main className="dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Your Dashboard</h1>

                        <p>
                            Create, manage and track
                            your shortened URLs.
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    <StatsCard
                        icon={<LinkIcon size={22} />}
                        title="Total Links"
                        value={urls.length}
                        description="Links you've created"
                    />

                    <StatsCard
                        icon={
                            <MousePointerClick
                                size={22}
                            />
                        }
                        title="Total Clicks"
                        value={totalClicks}
                        description="Across all your links"
                    />

                    <StatsCard
                        icon={<Link2 size={22} />}
                        title="Active Links"
                        value={activeLinks}
                        description="Currently active"
                    />

                    <StatsCard
                        icon={<Clock3 size={22} />}
                        title="Expiring Links"
                        value={
                            urls.filter(
                                (url) =>
                                    url.expiresAt
                            ).length
                        }
                        description="With expiration dates"
                    />
                </div>

                <UrlForm
                    onCreated={handleCreated}
                />

                <section className="links-section">
                    <div className="section-title-row">
                        <div>
                            <h2>My Links</h2>

                            <p>
                                Manage all your shortened
                                URLs.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <Loading text="Loading your links..." />
                    ) : urls.length === 0 ? (
                        <div className="empty-state">
                            <LinkIcon size={40} />

                            <h3>
                                No links yet
                            </h3>

                            <p>
                                Create your first
                                shortened URL above.
                            </p>
                        </div>
                    ) : (
                        <div className="url-list">
                            {urls.map((url) => (
                                <UrlCard
                                    key={url._id}
                                    url={url}
                                    onDeleted={
                                        handleDeleted
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
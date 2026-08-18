import { useEffect, useState } from "react";

import {
    ArrowLeft,
    MousePointerClick,
    Link2,
    CalendarDays,
    Clock,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

import api from "../services/api";
import formatDate from "../utils/formatDate";

const Analytics = () => {
    const { id } = useParams();

    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response =
                    await api.get(
                        `/analytics/${id}`
                    );

                setAnalytics(
                    response.data.analytics
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Unable to load analytics"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />

                <Loading text="Loading analytics..." />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <main className="analytics-page">
                    <div className="error-message">
                        {error}
                    </div>

                    <Link
                        to="/dashboard"
                        className="back-link"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>
                </main>
            </>
        );
    }

    return (
        <div className="app">
            <Navbar />

            <main className="analytics-page">
                <Link
                    to="/dashboard"
                    className="back-link"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                <div className="analytics-header">
                    <div>
                        <p className="eyebrow">
                            Analytics
                        </p>

                        <h1>
                            Link Performance
                        </h1>

                        <a
                            href={
                                analytics.url.shortUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="analytics-short-url"
                        >
                            {analytics.url.shortUrl}
                        </a>
                    </div>
                </div>

                <div className="analytics-stats">
                    <div className="analytics-stat">
                        <MousePointerClick
                            size={24}
                        />

                        <span>
                            Total Clicks
                        </span>

                        <strong>
                            {analytics.totalClicks}
                        </strong>
                    </div>

                    <div className="analytics-stat">
                        <CalendarDays
                            size={24}
                        />

                        <span>
                            Created
                        </span>

                        <strong>
                            {formatDate(
                                analytics.createdAt
                            )}
                        </strong>
                    </div>

                    <div className="analytics-stat">
                        <Clock size={24} />

                        <span>
                            Last Click
                        </span>

                        <strong>
                            {formatDate(
                                analytics.lastClickedAt
                            )}
                        </strong>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>
                                Click History
                            </h2>

                            <p>
                                Recent activity for
                                this short link.
                            </p>
                        </div>

                        <Link2 size={22} />
                    </div>

                    {analytics.clicks?.length === 0 ? (
                        <div className="empty-state">
                            <MousePointerClick
                                size={40}
                            />

                            <h3>
                                No clicks yet
                            </h3>

                            <p>
                                Share your short link
                                to start collecting
                                analytics.
                            </p>
                        </div>
                    ) : (
                        <div className="click-list">
                            {analytics.clicks.map(
                                (click) => (
                                    <div
                                        className="click-item"
                                        key={click._id}
                                    >
                                        <div>
                                            <strong>
                                                Click
                                            </strong>

                                            <p>
                                                {click.userAgent ||
                                                    "Unknown browser"}
                                            </p>
                                        </div>

                                        <span>
                                            {formatDate(
                                                click.clickedAt
                                            )}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Analytics;
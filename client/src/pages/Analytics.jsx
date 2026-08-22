import React, {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    MousePointerClick,
    Link2,
    CalendarDays,
    Clock,
    Menu,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

import api from "../services/api";
import formatDate from "../utils/formatDate";

const Analytics = () => {

    const { id } =
        useParams();

    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [mobileOpen, setMobileOpen] =
        useState(false);


    useEffect(() => {

        const fetchAnalytics =
            async () => {

                try {

                    const response =
                        await api.get(
                            `/analytics/${id}`
                        );

                    setAnalytics(
                        response.data
                            .analytics
                    );

                } catch (error) {

                    setError(
                        error.response
                            ?.data
                            ?.message ||
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
            <div className="dashboard-layout">

                <Sidebar
                    mobileOpen={
                        mobileOpen
                    }
                    setMobileOpen={
                        setMobileOpen
                    }
                />

                <main className="dashboard-main">

                    <Loading
                        text="Loading analytics..."
                    />

                </main>

            </div>
        );
    }


    if (error) {

        return (
            <div className="dashboard-layout">

                <Sidebar
                    mobileOpen={
                        mobileOpen
                    }
                    setMobileOpen={
                        setMobileOpen
                    }
                />

                <main className="dashboard-main">

                    <div className="dashboard-content">

                        <div className="error-message">
                            {error}
                        </div>

                        <Link
                            to="/analytics"
                            className="back-link"
                        >
                            <ArrowLeft
                                size={17}
                            />

                            Back to Analytics
                        </Link>

                    </div>

                </main>

            </div>
        );
    }


    return (
        <div className="dashboard-layout">

            <Sidebar
                mobileOpen={
                    mobileOpen
                }
                setMobileOpen={
                    setMobileOpen
                }
            />

            <main className="dashboard-main">

                {/* Topbar */}
                <header className="dashboard-topbar">

                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileOpen(
                                true
                            )
                        }
                    >
                        <Menu size={22} />
                    </button>

                    <div className="topbar-spacer" />

                </header>


                <div className="dashboard-content">

                    {/* Back */}
                    <Link
                        to="/analytics"
                        className="back-link"
                    >
                        <ArrowLeft
                            size={17}
                        />

                        Back to Analytics
                    </Link>


                    {/* Header */}
                    <div className="dashboard-heading">

                        <div>

                            <p className="analytics-eyebrow">
                                LINK ANALYTICS
                            </p>

                            <h1>
                                Link Performance
                            </h1>

                            {analytics?.url
                                ?.shortUrl && (
                                <a
                                    href={
                                        analytics
                                            .url
                                            .shortUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="analytics-short-url"
                                >
                                    {
                                        analytics
                                            .url
                                            .shortUrl
                                    }
                                </a>
                            )}

                        </div>

                    </div>


                    {/* Stats */}
                    <div className="dashboard-stats">

                        <div className="stats-card">

                            <div className="stats-card-icon">
                                <MousePointerClick
                                    size={21}
                                />
                            </div>

                            <div>

                                <span>
                                    Total Clicks
                                </span>

                                <strong>
                                    {
                                        analytics
                                            .totalClicks
                                    }
                                </strong>

                                <small>
                                    All time clicks
                                </small>

                            </div>

                        </div>


                        <div className="stats-card">

                            <div className="stats-card-icon">
                                <CalendarDays
                                    size={21}
                                />
                            </div>

                            <div>

                                <span>
                                    Created
                                </span>

                                <strong>
                                    {formatDate(
                                        analytics.createdAt
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div className="stats-card">

                            <div className="stats-card-icon">
                                <Clock size={21} />
                            </div>

                            <div>

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

                    </div>


                    {/* Click history */}
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


                        {!analytics.clicks ||
                        analytics.clicks.length ===
                            0 ? (

                            <div className="empty-state">

                                <MousePointerClick
                                    size={40}
                                />

                                <h3>
                                    No clicks yet
                                </h3>

                                <p>
                                    Share your short
                                    link to start
                                    collecting
                                    analytics.
                                </p>

                            </div>

                        ) : (

                            <div className="click-list">

                                {analytics.clicks.map(
                                    (
                                        click
                                    ) => (

                                        <div
                                            className="click-item"
                                            key={
                                                click._id
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    Click
                                                </strong>

                                                <p>
                                                    {
                                                        click.userAgent ||
                                                        "Unknown browser"
                                                    }
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

                </div>

            </main>

        </div>
    );
};

export default Analytics;
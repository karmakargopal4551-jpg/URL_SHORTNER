import React, {
    useEffect,
    useState,
} from "react";

import {
    BarChart3,
    MousePointerClick,
    Link2,
    Activity,
    ArrowRight,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ClicksChart from "../components/ClicksChart";
import ReferrerChart from "../components/ReferrerChart";

import api from "../services/api";

const AnalyticsOverview = () => {

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [links, setLinks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchLinks = async () => {
            try {

                const response =
                    await api.get("/urls");

                const data =
                    response.data?.urls ||
                    response.data?.data ||
                    response.data ||
                    [];

                setLinks(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Unable to load analytics:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchLinks();

    }, []);


    const totalLinks =
        links.length;

    const totalClicks =
        links.reduce(
            (sum, link) =>
                sum +
                Number(link.clicks || 0),
            0
        );

    const activeLinks =
        links.filter(
            (link) =>
                !link.expiresAt ||
                new Date(
                    link.expiresAt
                ) > new Date()
        ).length;


    const chartData = [
        {
            day: "Mon",
            clicks: Math.floor(
                totalClicks * 0.1
            ),
        },
        {
            day: "Tue",
            clicks: Math.floor(
                totalClicks * 0.15
            ),
        },
        {
            day: "Wed",
            clicks: Math.floor(
                totalClicks * 0.05
            ),
        },
        {
            day: "Thu",
            clicks: Math.floor(
                totalClicks * 0.2
            ),
        },
        {
            day: "Fri",
            clicks: Math.floor(
                totalClicks * 0.1
            ),
        },
        {
            day: "Sat",
            clicks: Math.floor(
                totalClicks * 0.2
            ),
        },
        {
            day: "Sun",
            clicks: Math.floor(
                totalClicks * 0.2
            ),
        },
    ];


    return (
        <div className="dashboard-layout">

            <Sidebar
                mobileOpen={mobileOpen}
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
                        <BarChart3 size={22} />
                    </button>

                    <div className="topbar-spacer" />

                </header>


                <div className="dashboard-content">

                    {/* Header */}
                    <div className="dashboard-heading">

                        <div>

                            <p className="analytics-eyebrow">
                                ANALYTICS
                            </p>

                            <h1>
                                Link Analytics
                            </h1>

                            <p>
                                Track the performance
                                of your shortened
                                URLs.
                            </p>

                        </div>

                    </div>


                    {/* Stats */}
                    <div className="dashboard-stats">

                        <div className="stats-card">

                            <div className="stats-card-icon">
                                <Link2 size={21} />
                            </div>

                            <div>
                                <span>
                                    Total Links
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalLinks}
                                </strong>

                                <small>
                                    All time links
                                </small>
                            </div>

                        </div>


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
                                    {loading
                                        ? "..."
                                        : totalClicks}
                                </strong>

                                <small>
                                    All time clicks
                                </small>
                            </div>

                        </div>


                        <div className="stats-card">

                            <div className="stats-card-icon">
                                <Activity
                                    size={21}
                                />
                            </div>

                            <div>
                                <span>
                                    Active Links
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : activeLinks}
                                </strong>

                                <small>
                                    Currently active
                                </small>
                            </div>

                        </div>

                    </div>


                    {/* Charts */}
                    <div className="dashboard-analytics-grid">

                        <ClicksChart
                            data={chartData}
                        />

                        <ReferrerChart />

                    </div>


                    {/* Individual link analytics */}
                    <div className="analytics-overview-card">

                        <div className="analytics-overview-card-header">

                            <div className="analytics-overview-card-icon">
                                <BarChart3
                                    size={22}
                                />
                            </div>

                            <div>

                                <h2>
                                    Link Performance
                                </h2>

                                <p>
                                    Select a link to view
                                    detailed analytics.
                                </p>

                            </div>

                        </div>


                        {links.length === 0 ? (

                            <div className="analytics-empty-state">

                                <BarChart3
                                    size={38}
                                />

                                <h3>
                                    No links available
                                </h3>

                                <p>
                                    Create your first
                                    short URL to start
                                    tracking analytics.
                                </p>

                                <Link
                                    to="/dashboard"
                                    className="analytics-dashboard-link"
                                >
                                    Create Short Link

                                    <ArrowRight
                                        size={17}
                                    />
                                </Link>

                            </div>

                        ) : (

                            <div className="analytics-link-list">

                                {links
                                    .slice(0, 10)
                                    .map(
                                        (
                                            link
                                        ) => (

                                            <div
                                                className="analytics-link-item"
                                                key={
                                                    link._id
                                                }
                                            >

                                                <div className="analytics-link-info">

                                                    <Link
                                                        to={`/analytics/${link._id}`}
                                                    >
                                                        {link.shortUrl ||
                                                            link.shortCode}
                                                    </Link>

                                                    <span>
                                                        {
                                                            link.originalUrl
                                                        }
                                                    </span>

                                                </div>

                                                <div className="analytics-link-clicks">

                                                    <MousePointerClick
                                                        size={16}
                                                    />

                                                    {link.clicks ||
                                                        0}

                                                    clicks

                                                </div>

                                                <Link
                                                    to={`/analytics/${link._id}`}
                                                    className="analytics-view-button"
                                                >
                                                    View

                                                    <ArrowRight
                                                        size={15}
                                                    />
                                                </Link>

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

export default AnalyticsOverview;
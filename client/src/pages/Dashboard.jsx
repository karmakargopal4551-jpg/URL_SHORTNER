import {
    useEffect,
    useState,
} from "react";

import {
    Menu,
    Plus,
    Bell,
    Link2,
    MousePointerClick,
    Clock,
    CheckCheck,
    X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import UrlForm from "../components/UrlForm";
import RecentLinks from "../components/RecentLinks";
import ClicksChart from "../components/ClicksChart";
import ReferrerChart from "../components/ReferrerChart";
import DonationCard from "../components/DonationCard";
import UpgradeBanner from "../components/UpgradeBanner";
import UpgradeModal from "../components/UpgradeModal";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";


const Dashboard = () => {

    const { user } = useAuth();

    // =========================================
    // MOBILE SIDEBAR
    // =========================================

    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);


    // =========================================
    // UPGRADE MODAL
    // =========================================

    const [
        showUpgrade,
        setShowUpgrade,
    ] = useState(false);


    // =========================================
    // NOTIFICATION
    // =========================================

    const [
        notificationsOpen,
        setNotificationsOpen,
    ] = useState(false);


    const [
        notificationsRead,
        setNotificationsRead,
    ] = useState(false);


    // =========================================
    // LINKS
    // =========================================

    const [
        links,
        setLinks,
    ] = useState([]);


    // =========================================
    // STATS
    // =========================================

    const [
        stats,
        setStats,
    ] = useState({
        totalLinks: 0,
        totalClicks: 0,
        activeLinks: 0,
        expiringLinks: 0,
    });


    // =========================================
    // FETCH LINKS
    // =========================================

    const fetchLinks = async () => {

        try {

            const response =
                await api.get("/urls");


            const data =
                response.data?.urls ||
                response.data?.data ||
                response.data ||
                [];


            setLinks(data);


            // -----------------------------
            // TOTAL LINKS
            // -----------------------------

            const totalLinks =
                data.length;


            // -----------------------------
            // TOTAL CLICKS
            // -----------------------------

            const totalClicks =
                data.reduce(
                    (sum, link) =>
                        sum +
                        (
                            link.clickCount ||
                            link.clicks ||
                            0
                        ),
                    0
                );


            // -----------------------------
            // ACTIVE LINKS
            // -----------------------------

            const activeLinks =
                data.filter(
                    (link) => {

                        if (
                            link.isActive === false
                        ) {
                            return false;
                        }

                        if (
                            !link.expiresAt
                        ) {
                            return true;
                        }

                        return (
                            new Date(
                                link.expiresAt
                            ) > new Date()
                        );

                    }
                ).length;


            // -----------------------------
            // EXPIRING LINKS
            // -----------------------------

            const expiringLinks =
                data.filter(
                    (link) => {

                        if (
                            !link.expiresAt
                        ) {
                            return false;
                        }

                        return (
                            new Date(
                                link.expiresAt
                            ) > new Date()
                        );

                    }
                ).length;


            setStats({

                totalLinks,

                totalClicks,

                activeLinks,

                expiringLinks,

            });


        } catch (error) {

            console.error(
                "Unable to load links:",
                error
            );

        }

    };


    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        fetchLinks();

    }, []);


    // =========================================
    // OPEN UPGRADE EVENT
    // =========================================

    useEffect(() => {

        const openUpgrade = () => {

            setShowUpgrade(true);

        };


        window.addEventListener(
            "open-upgrade",
            openUpgrade
        );


        return () => {

            window.removeEventListener(
                "open-upgrade",
                openUpgrade
            );

        };

    }, []);


    // =========================================
    // CLOSE NOTIFICATION ON OUTSIDE CLICK
    // =========================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                !event.target.closest(
                    ".notification-wrapper"
                )
            ) {

                setNotificationsOpen(false);

            }

        };


        if (notificationsOpen) {

            document.addEventListener(
                "click",
                handleOutsideClick
            );

        }


        return () => {

            document.removeEventListener(
                "click",
                handleOutsideClick
            );

        };

    }, [notificationsOpen]);


    // =========================================
    // COPY URL
    // =========================================

    const handleCopy = async (url) => {

        try {

            await navigator.clipboard.writeText(
                url
            );

            alert(
                "Short URL copied!"
            );

        } catch (error) {

            console.error(error);

        }

    };


    // =========================================
    // DELETE URL
    // =========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this link?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await api.delete(
                `/urls/${id}`
            );


            fetchLinks();


        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );


            alert(
                error.response?.data
                    ?.message ||
                "Unable to delete link."
            );

        }

    };


    // =========================================
    // URL CREATED
    // =========================================

    const handleUrlCreated = () => {

        fetchLinks();

    };


    // =========================================
    // NOTIFICATION CLICK
    // =========================================

    const handleNotificationClick = (
        event
    ) => {

        event.stopPropagation();

        setNotificationsOpen(
            (previous) =>
                !previous
        );

    };


    // =========================================
    // MARK ALL AS READ
    // =========================================

    const handleMarkAllRead = () => {

        setNotificationsRead(true);

    };


    // =========================================
    // GENERATE NOTIFICATIONS
    // =========================================

    const notifications = [];


    // New link notification

    if (stats.totalLinks > 0) {

        notifications.push({

            id: "links",

            icon: Link2,

            title: "Short links",

            message:
                `You have ${stats.totalLinks} short ${
                    stats.totalLinks === 1
                        ? "link"
                        : "links"
                }.`,

            time: "Recently",

        });

    }


    // Click notification

    if (stats.totalClicks > 0) {

        notifications.push({

            id: "clicks",

            icon: MousePointerClick,

            title: "Link activity",

            message:
                `Your links received ${stats.totalClicks} ${
                    stats.totalClicks === 1
                        ? "click"
                        : "clicks"
                }.`,


            time: "Recently",

        });

    }


    // Expiration notification

    if (stats.expiringLinks > 0) {

        notifications.push({

            id: "expiration",

            icon: Clock,

            title: "Expiration reminder",

            message:
                `${stats.expiringLinks} ${
                    stats.expiringLinks === 1
                        ? "link has"
                        : "links have"
                } an expiration date.`,

            time: "Check your links",

        });

    }


    // Default notification

    if (
        notifications.length === 0
    ) {

        notifications.push({

            id: "welcome",

            icon: Bell,

            title: "Welcome to Shortly",

            message:
                "Create your first short link to get started.",

            time: "Welcome",

        });

    }


    // =========================================
    // CHART DATA
    // =========================================

    const chartData = [

        {
            day: "Mon",
            clicks: Math.floor(
                stats.totalClicks * 0.1
            ),
        },

        {
            day: "Tue",
            clicks: Math.floor(
                stats.totalClicks * 0.15
            ),
        },

        {
            day: "Wed",
            clicks: Math.floor(
                stats.totalClicks * 0.05
            ),
        },

        {
            day: "Thu",
            clicks: Math.floor(
                stats.totalClicks * 0.2
            ),
        },

        {
            day: "Fri",
            clicks: Math.floor(
                stats.totalClicks * 0.1
            ),
        },

        {
            day: "Sat",
            clicks: Math.floor(
                stats.totalClicks * 0.2
            ),
        },

        {
            day: "Sun",
            clicks: Math.floor(
                stats.totalClicks * 0.2
            ),
        },

    ];


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="dashboard-layout">


            {/* =================================
                SIDEBAR
            ================================= */}

            <Sidebar
                mobileOpen={
                    mobileOpen
                }

                setMobileOpen={
                    setMobileOpen
                }
            />


            {/* =================================
                MAIN
            ================================= */}

            <main className="dashboard-main">


                {/* =================================
                    TOP BAR
                ================================= */}

                <header
                    className="dashboard-topbar"
                >

                    {/* Mobile Menu */}

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


                    <div
                        className="topbar-spacer"
                    />


                    {/* =================================
                        NOTIFICATIONS
                    ================================= */}

                    <div
                        className="notification-wrapper"
                    >

                        <button
                            className={`notification-button ${
                                notificationsOpen
                                    ? "notification-button-active"
                                    : ""
                            }`}

                            onClick={
                                handleNotificationClick
                            }

                            aria-label="Notifications"
                        >

                            <Bell size={20} />


                            {/* Unread Dot */}

                            {!notificationsRead && (

                                <span />

                            )}

                        </button>


                        {/* =================================
                            NOTIFICATION POPUP
                        ================================= */}

                        {notificationsOpen && (

                            <div
                                className="notification-dropdown"
                            >


                                {/* Header */}

                                <div
                                    className="notification-header"
                                >

                                    <div>

                                        <h3>
                                            Notifications
                                        </h3>

                                        <p>
                                            Stay updated with your account
                                        </p>

                                    </div>


                                    <button
                                        className="notification-close"

                                        onClick={() =>
                                            setNotificationsOpen(
                                                false
                                            )
                                        }
                                    >

                                        <X size={17} />

                                    </button>

                                </div>


                                {/* Notification List */}

                                <div
                                    className="notification-list"
                                >

                                    {notifications.map(
                                        (
                                            notification
                                        ) => {

                                            const Icon =
                                                notification.icon;


                                            return (

                                                <div
                                                    key={
                                                        notification.id
                                                    }

                                                    className={`notification-item ${
                                                        notificationsRead
                                                            ? "notification-item-read"
                                                            : ""
                                                    }`}
                                                >

                                                    <div
                                                        className="notification-icon"
                                                    >

                                                        <Icon
                                                            size={18}
                                                        />

                                                    </div>


                                                    <div
                                                        className="notification-content"
                                                    >

                                                        <strong>
                                                            {
                                                                notification.title
                                                            }
                                                        </strong>

                                                        <p>
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        <small>
                                                            {
                                                                notification.time
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>


                                {/* Footer */}

                                <div
                                    className="notification-footer"
                                >

                                    <button
                                        onClick={
                                            handleMarkAllRead
                                        }

                                        disabled={
                                            notificationsRead
                                        }
                                    >

                                        <CheckCheck
                                            size={16}
                                        />

                                        {notificationsRead
                                            ? "All notifications read"
                                            : "Mark all as read"}

                                    </button>

                                </div>


                            </div>

                        )}

                    </div>


                    {/* =================================
                        USER
                    ================================= */}

                    <div
                        className="topbar-user"
                    >

                        <div
                            className="topbar-avatar"
                        >

                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "G"}

                        </div>


                        <strong>

                            {user?.name ||
                                "GOPAL KARMKAR"}

                        </strong>

                    </div>

                </header>


                {/* =================================
                    CONTENT
                ================================= */}

                <div
                    className="dashboard-content"
                >


                    {/* Welcome */}

                    <div
                        className="dashboard-heading"
                    >

                        <div>

                            <h1>

                                Welcome back,{" "}

                                {user?.name ||
                                    "GOPAL"}{" "}

                                👋

                            </h1>


                            <p>

                                Here's what's
                                happening with
                                your links today.

                            </p>

                        </div>


                        <button
                            className="create-link-top"

                            onClick={() =>
                                document
                                    .getElementById(
                                        "create-url"
                                    )
                                    ?.scrollIntoView(
                                        {
                                            behavior:
                                                "smooth",
                                        }
                                    )
                            }
                        >

                            <Plus size={19} />

                            Create New Link

                        </button>

                    </div>


                    {/* Stats */}

                    <div
                        className="dashboard-stats"
                    >

                        <StatsCard
                            title="Total Links"
                            value={
                                stats.totalLinks
                            }
                            description="All time links"
                            icon="link"
                        />


                        <StatsCard
                            title="Total Clicks"
                            value={
                                stats.totalClicks
                            }
                            description="All time clicks"
                            icon="clicks"
                        />


                        <StatsCard
                            title="Active Links"
                            value={
                                stats.activeLinks
                            }
                            description="Currently active"
                            icon="active"
                        />


                        <StatsCard
                            title="Expiring Links"
                            value={
                                stats.expiringLinks
                            }
                            description="With expiration date"
                            icon="clock"
                        />

                    </div>


                    {/* Upgrade */}

                    <UpgradeBanner
                        onUpgrade={() =>
                            setShowUpgrade(
                                true
                            )
                        }
                    />


                    {/* Create URL */}

                    <section
                        id="create-url"
                        className="dashboard-create-section"
                    >

                        <UrlForm
                            onSuccess={
                                handleUrlCreated
                            }
                        />

                    </section>


                    {/* Analytics */}

                    <div
                        className="dashboard-analytics-grid"
                    >

                        <ClicksChart
                            data={chartData}
                        />

                        <ReferrerChart />

                    </div>


                    {/* Bottom */}

                    <div
                        className="dashboard-bottom-grid"
                    >

                        <RecentLinks
                            links={links}

                            onCopy={
                                handleCopy
                            }

                            onDelete={
                                handleDelete
                            }
                        />


                        <DonationCard />

                    </div>

                </div>

            </main>


            {/* =================================
                UPGRADE MODAL
            ================================= */}

            {showUpgrade && (

                <UpgradeModal

                    onClose={() =>
                        setShowUpgrade(
                            false
                        )
                    }

                    onSuccess={() => {

                        setShowUpgrade(
                            false
                        );

                    }}

                />

            )}

        </div>

    );

};


export default Dashboard;
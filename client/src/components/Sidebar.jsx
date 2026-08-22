import React from "react";

import {
    LayoutDashboard,
    Link2,
    BarChart3,
    QrCode,
    User,
    Settings,
    CircleHelp,
    Heart,
    X,
    LogOut,
} from "lucide-react";

import {
    useNavigate,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Sidebar = ({
    mobileOpen,
    setMobileOpen,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();

    // =========================================
    // MENU ITEMS
    // =========================================

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },

        {
            name: "My Links",
            icon: Link2,
            path: "/dashboard",
        },

        {
            name: "Analytics",
            icon: BarChart3,
            path: "/analytics",
        },

        {
            name: "QR Codes",
            icon: QrCode,
            path: "/dashboard",
            action: "qr",
        },

        {
            name: "Profile",
            icon: User,
            path: "/profile",
        },

        {
            name: "Settings",
            icon: Settings,
            path: "/settings",
        },

        {
            name: "Support",
            icon: CircleHelp,
            path: "/support",
        },
    ];

    // =========================================
    // NORMAL NAVIGATION
    // =========================================

    const handleNavigation = (path) => {
        navigate(path);

        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    // =========================================
    // OPEN QR MODAL
    // =========================================

    const handleQR = () => {
        window.dispatchEvent(
            new Event("open-qr")
        );

        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    // =========================================
    // DONATION
    // =========================================

    const handleDonate = () => {
        window.dispatchEvent(
            new Event("open-donation")
        );

        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {
        logout();

        navigate("/login");
    };

    // =========================================
    // ACTIVE MENU
    // =========================================

    const isActive = (item) => {

        // QR Codes is a modal,
        // therefore it should not become
        // active just because its path is /dashboard.
        if (item.action === "qr") {
            return false;
        }

        const path = item.path;

        if (path === "/dashboard") {
            return (
                location.pathname ===
                "/dashboard"
            );
        }

        if (path === "/analytics") {
            return location.pathname.startsWith(
                "/analytics"
            );
        }

        return location.pathname === path;
    };

    return (
        <>
            {/* =================================
                MOBILE OVERLAY
            ================================= */}

            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setMobileOpen(false)
                    }
                />
            )}

            {/* =================================
                SIDEBAR
            ================================= */}

            <aside
                className={`dashboard-sidebar ${
                    mobileOpen
                        ? "sidebar-mobile-open"
                        : ""
                }`}
            >

                {/* =================================
                    LOGO
                ================================= */}

                <div className="sidebar-logo">

                    <div className="sidebar-logo-icon">
                        <Link2 size={23} />
                    </div>

                    <span>
                        Shortly
                    </span>

                    <button
                        className="sidebar-mobile-close"
                        onClick={() =>
                            setMobileOpen(false)
                        }
                    >
                        <X size={21} />
                    </button>

                </div>


                {/* =================================
                    NAVIGATION
                ================================= */}

                <nav className="sidebar-navigation">

                    {menuItems.map((item) => {

                        const Icon =
                            item.icon;

                        const active =
                            isActive(item);

                        return (
                            <button
                                key={item.name}
                                className={`sidebar-item ${
                                    active
                                        ? "sidebar-item-active"
                                        : ""
                                }`}
                                onClick={() => {

                                    if (
                                        item.action ===
                                        "qr"
                                    ) {
                                        handleQR();
                                    } else {
                                        handleNavigation(
                                            item.path
                                        );
                                    }

                                }}
                            >

                                <Icon size={20} />

                                <span>
                                    {item.name}
                                </span>

                            </button>
                        );

                    })}


                    {/* =================================
                        DONATION
                    ================================= */}

                    <button
                        className="sidebar-donate"
                        onClick={handleDonate}
                    >

                        <Heart
                            size={20}
                            fill="currentColor"
                        />

                        <div>

                            <strong>
                                Donate ❤️
                            </strong>

                            <small>
                                Support Shortly
                            </small>

                        </div>

                    </button>

                </nav>


                {/* =================================
                    CURRENT PLAN
                ================================= */}

                <div className="sidebar-plan">

                    <p className="sidebar-plan-label">
                        Current Plan
                    </p>

                    <div className="sidebar-plan-title">
                        💎 Pro
                    </div>

                    <p className="sidebar-plan-date">
                        ₹1/month plan
                    </p>

                    <button
                        onClick={() =>
                            window.dispatchEvent(
                                new Event(
                                    "open-upgrade"
                                )
                            )
                        }
                    >
                        Manage Plan
                    </button>

                </div>


                {/* =================================
                    USER
                ================================= */}

                <div className="sidebar-user">

                    <div className="sidebar-user-avatar">

                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "G"}

                    </div>


                    <div className="sidebar-user-info">

                        <strong>
                            {user?.name ||
                                "GOPAL KARMKAR"}
                        </strong>

                        <span>
                            {user?.email ||
                                "user@example.com"}
                        </span>

                    </div>


                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={17} />
                    </button>

                </div>

            </aside>
        </>
    );
};

export default Sidebar;
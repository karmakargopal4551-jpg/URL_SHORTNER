import React, {
    useEffect,
    useState,
} from "react";

import {
    Settings as SettingsIcon,
    Bell,
    ShieldCheck,
    Sun,
    Moon,
    Lock,
    CreditCard,
    User,
    LogOut,
    CheckCircle,
    X,
    Eye,
    EyeOff,
    Check,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Settings = () => {
    const [mobileOpen, setMobileOpen] =
        useState(false);

    const { user, logout } = useAuth();

    // ==============================
    // DARK MODE
    // ==============================

    const [darkMode, setDarkMode] = useState(() => {
        return (
            localStorage.getItem("theme") ===
            "dark"
        );
    });

    // ==============================
    // EMAIL NOTIFICATIONS
    // ==============================

    const [
        emailNotifications,
        setEmailNotifications,
    ] = useState(() => {
        const saved =
            localStorage.getItem(
                "emailNotifications"
            );

        return saved !== "false";
    });

    // ==============================
    // PASSWORD MODAL
    // ==============================

    const [
        passwordModalOpen,
        setPasswordModalOpen,
    ] = useState(false);

    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [
        passwordLoading,
        setPasswordLoading,
    ] = useState(false);

    const [
        passwordError,
        setPasswordError,
    ] = useState("");

    const [
        passwordSuccess,
        setPasswordSuccess,
    ] = useState("");

    // ==============================
    // APPLY DARK MODE
    // ==============================

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add(
                "dark"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );
        } else {
            document.documentElement.classList.remove(
                "dark"
            );

            localStorage.setItem(
                "theme",
                "light"
            );
        }
    }, [darkMode]);

    // ==============================
    // EMAIL NOTIFICATION
    // ==============================

    useEffect(() => {
        localStorage.setItem(
            "emailNotifications",
            emailNotifications
        );
    }, [emailNotifications]);

    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    // ==============================
    // OPEN PASSWORD MODAL
    // ==============================

    const openPasswordModal = () => {
        setPasswordModalOpen(true);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordError("");
        setPasswordSuccess("");
    };

    // ==============================
    // CLOSE PASSWORD MODAL
    // ==============================

    const closePasswordModal = () => {
        if (passwordLoading) {
            return;
        }

        setPasswordModalOpen(false);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordError("");
        setPasswordSuccess("");
    };

    // ==============================
    // CHANGE PASSWORD
    // ==============================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordError("");
        setPasswordSuccess("");

        // Validate current password
        if (!currentPassword) {
            setPasswordError(
                "Please enter your current password."
            );

            return;
        }

        // Validate new password
        if (!newPassword) {
            setPasswordError(
                "Please enter a new password."
            );

            return;
        }

        // Minimum password length
        if (newPassword.length < 6) {
            setPasswordError(
                "New password must be at least 6 characters."
            );

            return;
        }

        // Confirm password
        if (newPassword !== confirmPassword) {
            setPasswordError(
                "New passwords do not match."
            );

            return;
        }

        // Prevent same password
        if (
            currentPassword ===
            newPassword
        ) {
            setPasswordError(
                "New password must be different from your current password."
            );

            return;
        }

        try {
            setPasswordLoading(true);

            const response = await api.put(
                "/auth/change-password",
                {
                    currentPassword,
                    newPassword,
                }
            );

            if (response.data.success) {
                setPasswordSuccess(
                    "Password changed successfully!"
                );

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                // Close modal after 1.5 seconds
                setTimeout(() => {
                    setPasswordModalOpen(false);
                    setPasswordSuccess("");
                }, 1500);
            }
        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            setPasswordError(
                error.response?.data?.message ||
                    "Unable to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    // ==============================
    // USER INFORMATION
    // ==============================

    const userName =
        user?.name || "GOPAL KARMKAR";

    const userEmail =
        user?.email ||
        "user@example.com";

    const subscription =
        user?.subscription?.plan || "pro";

    return (
        <div className="dashboard-layout">

            {/* ==========================
                SIDEBAR
            ========================== */}

            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* ==========================
                MAIN
            ========================== */}

            <main className="dashboard-main">

                <header className="dashboard-topbar">
                    <div className="topbar-spacer" />
                </header>

                <div className="dashboard-content settings-content">

                    {/* ==========================
                        HEADER
                    ========================== */}

                    <div className="settings-page-header">

                        <div>
                            <p className="analytics-eyebrow">
                                SETTINGS
                            </p>

                            <h1>
                                Settings
                            </h1>

                            <p>
                                Manage your Shortly
                                account preferences.
                            </p>
                        </div>

                    </div>

                    {/* ==========================
                        SETTINGS CONTAINER
                    ========================== */}

                    <div className="settings-sections">

                        {/* ==========================
                            APPEARANCE
                        ========================== */}

                        <section className="settings-section-card">

                            <div className="settings-section-header">

                                <div className="settings-section-icon">
                                    <SettingsIcon
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2>
                                        Appearance
                                    </h2>

                                    <p>
                                        Customize how
                                        Shortly looks
                                        for you.
                                    </p>
                                </div>

                            </div>

                            <div className="settings-option">

                                <div className="settings-option-left">

                                    <div className="settings-option-icon">

                                        {darkMode ? (
                                            <Moon
                                                size={19}
                                            />
                                        ) : (
                                            <Sun
                                                size={19}
                                            />
                                        )}

                                    </div>

                                    <div>
                                        <h3>
                                            Dark Mode
                                        </h3>

                                        <p>
                                            {darkMode
                                                ? "Use the dark theme across Shortly."
                                                : "Use the light theme across Shortly."}
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className={`settings-toggle ${
                                        darkMode
                                            ? "settings-toggle-active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setDarkMode(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                    aria-label="Toggle dark mode"
                                >
                                    <span />
                                </button>

                            </div>

                        </section>

                        {/* ==========================
                            NOTIFICATIONS
                        ========================== */}

                        <section className="settings-section-card">

                            <div className="settings-section-header">

                                <div className="settings-section-icon">
                                    <Bell
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2>
                                        Notifications
                                    </h2>

                                    <p>
                                        Control your
                                        notification
                                        preferences.
                                    </p>
                                </div>

                            </div>

                            <div className="settings-option">

                                <div className="settings-option-left">

                                    <div className="settings-option-icon">
                                        <Bell
                                            size={19}
                                        />
                                    </div>

                                    <div>
                                        <h3>
                                            Email
                                            Notifications
                                        </h3>

                                        <p>
                                            Receive
                                            important
                                            updates
                                            about your
                                            account.
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className={`settings-toggle ${
                                        emailNotifications
                                            ? "settings-toggle-active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setEmailNotifications(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                    aria-label="Toggle email notifications"
                                >
                                    <span />
                                </button>

                            </div>

                        </section>

                        {/* ==========================
                            SECURITY
                        ========================== */}

                        <section className="settings-section-card">

                            <div className="settings-section-header">

                                <div className="settings-section-icon">
                                    <ShieldCheck
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2>
                                        Security
                                    </h2>

                                    <p>
                                        Manage your
                                        account
                                        security.
                                    </p>
                                </div>

                            </div>

                            <div className="settings-action-card">

                                <div className="settings-action-icon">
                                    <Lock size={20} />
                                </div>

                                <div className="settings-action-info">

                                    <h3>
                                        Password
                                    </h3>

                                    <p>
                                        Keep your
                                        account secure
                                        with a strong
                                        password.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="settings-arrow-btn"
                                    onClick={
                                        openPasswordModal
                                    }
                                >
                                    →
                                </button>

                            </div>

                        </section>

                        {/* ==========================
                            SUBSCRIPTION
                        ========================== */}

                        <section className="settings-section-card">

                            <div className="settings-section-header">

                                <div className="settings-section-icon">
                                    <CreditCard
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2>
                                        Subscription
                                    </h2>

                                    <p>
                                        Manage your
                                        Shortly plan.
                                    </p>
                                </div>

                            </div>

                            <div className="subscription-settings-card">

                                <div>

                                    <span className="subscription-label">
                                        CURRENT PLAN
                                    </span>

                                    <h3>
                                        💎{" "}
                                        {subscription
                                            .charAt(0)
                                            .toUpperCase() +
                                            subscription.slice(
                                                1
                                            )}
                                    </h3>

                                    <p>
                                        ₹1/month plan
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="manage-plan-btn"
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

                        </section>

                        {/* ==========================
                            ACCOUNT
                        ========================== */}

                        <section className="settings-section-card">

                            <div className="settings-section-header">

                                <div className="settings-section-icon">
                                    <User
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2>
                                        Account
                                    </h2>

                                    <p>
                                        Information
                                        about your
                                        Shortly
                                        account.
                                    </p>
                                </div>

                            </div>

                            <div className="account-settings-info">

                                <div className="account-user-avatar">
                                    {userName
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="account-user-details">

                                    <h3>
                                        {userName}
                                    </h3>

                                    <p>
                                        {userEmail}
                                    </p>

                                    <div className="account-status">
                                        <CheckCircle
                                            size={15}
                                        />
                                        Active Account
                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* ==========================
                            SIGN OUT
                        ========================== */}

                        <section className="settings-section-card settings-danger-section">

                            <div className="settings-section-header">

                                <div className="settings-section-icon settings-danger-icon">
                                    <LogOut
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2>
                                        Sign out
                                    </h2>

                                    <p>
                                        Sign out from
                                        your Shortly
                                        account on
                                        this device.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                className="settings-logout-btn"
                                onClick={
                                    handleLogout
                                }
                            >
                                <LogOut size={17} />
                                Logout
                            </button>

                        </section>

                    </div>

                </div>

            </main>

            {/* =================================================
                CHANGE PASSWORD MODAL
            ================================================= */}

            {passwordModalOpen && (
                <div
                    className="password-modal-overlay"
                    onClick={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closePasswordModal();
                        }
                    }}
                >

                    <div className="password-modal">

                        {/* HEADER */}

                        <div className="password-modal-header">

                            <div>
                                <div className="password-modal-icon">
                                    <Lock
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2>
                                        Change Password
                                    </h2>

                                    <p>
                                        Update your
                                        account
                                        password.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="password-modal-close"
                                onClick={
                                    closePasswordModal
                                }
                                disabled={
                                    passwordLoading
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleChangePassword
                            }
                            className="password-form"
                        >

                            {/* ERROR */}

                            {passwordError && (
                                <div className="password-error">
                                    {passwordError}
                                </div>
                            )}

                            {/* SUCCESS */}

                            {passwordSuccess && (
                                <div className="password-success">
                                    <Check
                                        size={17}
                                    />
                                    {passwordSuccess}
                                </div>
                            )}

                            {/* CURRENT PASSWORD */}

                            <div className="password-field">

                                <label>
                                    Current Password
                                </label>

                                <div className="password-input-wrapper">

                                    <Lock
                                        size={17}
                                    />

                                    <input
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            currentPassword
                                        }
                                        onChange={(e) =>
                                            setCurrentPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter current password"
                                        disabled={
                                            passwordLoading
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        disabled={
                                            passwordLoading
                                        }
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff
                                                size={17}
                                            />
                                        ) : (
                                            <Eye
                                                size={17}
                                            />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* NEW PASSWORD */}

                            <div className="password-field">

                                <label>
                                    New Password
                                </label>

                                <div className="password-input-wrapper">

                                    <Lock
                                        size={17}
                                    />

                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            newPassword
                                        }
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter new password"
                                        disabled={
                                            passwordLoading
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNewPassword(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        disabled={
                                            passwordLoading
                                        }
                                    >
                                        {showNewPassword ? (
                                            <EyeOff
                                                size={17}
                                            />
                                        ) : (
                                            <Eye
                                                size={17}
                                            />
                                        )}
                                    </button>

                                </div>

                                <small>
                                    Password must be at
                                    least 6 characters.
                                </small>

                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className="password-field">

                                <label>
                                    Confirm New Password
                                </label>

                                <div className="password-input-wrapper">

                                    <Lock
                                        size={17}
                                    />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Confirm new password"
                                        disabled={
                                            passwordLoading
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        disabled={
                                            passwordLoading
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff
                                                size={17}
                                            />
                                        ) : (
                                            <Eye
                                                size={17}
                                            />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* BUTTONS */}

                            <div className="password-modal-actions">

                                <button
                                    type="button"
                                    className="password-cancel-btn"
                                    onClick={
                                        closePasswordModal
                                    }
                                    disabled={
                                        passwordLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="password-change-btn"
                                    disabled={
                                        passwordLoading
                                    }
                                >
                                    <Lock size={17} />

                                    {passwordLoading
                                        ? "Changing..."
                                        : "Change Password"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Settings;
import React, { useState } from "react";

import {
    User,
    Mail,
    Pencil,
    Check,
    X,
    ShieldCheck,
    CalendarDays,
    Link2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const {
        user,
        updateUser,
    } = useAuth();

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [isEditing, setIsEditing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const name =
        user?.name || "GOPAL KARMKAR";

    const email =
        user?.email || "user@example.com";

    const [formData, setFormData] = useState({
        name,
        email,
    });

    const handleEdit = () => {
        setFormData({
            name,
            email,
        });

        setMessage("");
        setError("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            name,
            email,
        });

        setMessage("");
        setError("");
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const trimmedName =
            formData.name.trim();

        const trimmedEmail =
            formData.email.trim();

        if (!trimmedName) {
            setError(
                "Name cannot be empty."
            );
            return;
        }

        if (!trimmedEmail) {
            setError(
                "Email cannot be empty."
            );
            return;
        }

        try {
            setSaving(true);

            /*
             * FRONTEND ONLY FOR NOW
             *
             * Backend API will be connected
             * in the next step.
             */
            if (updateUser) {
                updateUser({
                    ...user,
                    name: trimmedName,
                    email: trimmedEmail,
                });
            }

            setMessage(
                "Profile updated successfully."
            );

            setIsEditing(false);
        } catch (err) {
            setError(
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main */}
            <main className="dashboard-main">

                {/* Topbar */}
                <header className="dashboard-topbar">
                    <div className="topbar-spacer" />
                </header>

                <div className="dashboard-content profile-content">

                    {/* Page Header */}
                    <div className="profile-heading">

                        <div>
                            <p className="profile-eyebrow">
                                PROFILE
                            </p>

                            <h1>
                                Your Profile
                            </h1>

                            <p className="profile-subtitle">
                                Manage your Shortly
                                account and personal
                                information.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                className="profile-edit-button"
                                onClick={handleEdit}
                            >
                                <Pencil size={17} />
                                Edit Profile
                            </button>
                        )}

                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="profile-success">
                            <Check size={18} />
                            <span>
                                {message}
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="profile-error">
                            <X size={18} />
                            <span>
                                {error}
                            </span>
                        </div>
                    )}

                    {/* Profile Hero Card */}
                    <div className="profile-hero-card">

                        <div className="profile-hero-background" />

                        <div className="profile-hero-content">

                            {/* Avatar */}
                            <div className="profile-avatar-wrapper">
                                <div className="profile-large-avatar">
                                    {(isEditing
                                        ? formData.name
                                        : name
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="profile-online-dot" />
                            </div>

                            {/* User information */}
                            <div className="profile-hero-info">

                                <h2>
                                    {isEditing
                                        ? formData.name
                                        : name}
                                </h2>

                                <p>
                                    {email}
                                </p>

                                <div className="profile-status">
                                    <ShieldCheck
                                        size={15}
                                    />

                                    <span>
                                        Verified Account
                                    </span>
                                </div>

                            </div>

                            {/* Account badge */}
                            <div className="profile-plan-badge">
                                <span>
                                    💎
                                </span>

                                <div>
                                    <small>
                                        Current Plan
                                    </small>

                                    <strong>
                                        Pro
                                    </strong>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Main Profile Grid */}
                    <div className="profile-grid">

                        {/* Personal Information */}
                        <div className="profile-information-card">

                            <div className="profile-card-header">

                                <div>
                                    <h3>
                                        Personal
                                        Information
                                    </h3>

                                    <p>
                                        Update your
                                        account details.
                                    </p>
                                </div>

                                <div className="profile-card-icon">
                                    <User size={20} />
                                </div>

                            </div>

                            <form
                                onSubmit={
                                    handleSave
                                }
                            >

                                {/* Name */}
                                <div className="profile-input-group">

                                    <label>
                                        Full Name
                                    </label>

                                    {isEditing ? (
                                        <div className="profile-input-wrapper">
                                            <User
                                                size={18}
                                            />

                                            <input
                                                type="text"
                                                name="name"
                                                value={
                                                    formData.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    ) : (
                                        <div className="profile-display-field">
                                            <User
                                                size={18}
                                            />

                                            <span>
                                                {name}
                                            </span>
                                        </div>
                                    )}

                                </div>

                                {/* Email */}
                                <div className="profile-input-group">

                                    <label>
                                        Email Address
                                    </label>

                                    {isEditing ? (
                                        <div className="profile-input-wrapper">
                                            <Mail
                                                size={18}
                                            />

                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    formData.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    ) : (
                                        <div className="profile-display-field">
                                            <Mail
                                                size={18}
                                            />

                                            <span>
                                                {email}
                                            </span>
                                        </div>
                                    )}

                                </div>

                                {/* Buttons */}
                                {isEditing && (
                                    <div className="profile-form-actions">

                                        <button
                                            type="button"
                                            className="profile-cancel-button"
                                            onClick={
                                                handleCancel
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            <X
                                                size={17}
                                            />

                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="profile-save-button"
                                            disabled={
                                                saving
                                            }
                                        >
                                            <Check
                                                size={17}
                                            />

                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                    </div>
                                )}

                            </form>
                        </div>

                        {/* Account Information */}
                        <div className="profile-account-card">

                            <div className="profile-card-header">

                                <div>
                                    <h3>
                                        Account
                                        Information
                                    </h3>

                                    <p>
                                        Overview of your
                                        Shortly account.
                                    </p>
                                </div>

                                <div className="profile-card-icon">
                                    <ShieldCheck
                                        size={20}
                                    />
                                </div>

                            </div>

                            <div className="profile-account-list">

                                <div className="profile-account-item">

                                    <div className="profile-account-item-icon">
                                        <ShieldCheck
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            Account Status
                                        </span>

                                        <strong className="profile-active">
                                            Active
                                        </strong>
                                    </div>

                                </div>

                                <div className="profile-account-item">

                                    <div className="profile-account-item-icon">
                                        <CalendarDays
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            Membership
                                        </span>

                                        <strong>
                                            Pro Plan
                                        </strong>
                                    </div>

                                </div>

                                <div className="profile-account-item">

                                    <div className="profile-account-item-icon">
                                        <Link2
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            Short Links
                                        </span>

                                        <strong>
                                            Available
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Security Card */}
                    <div className="profile-security-card">

                        <div className="profile-security-icon">
                            <ShieldCheck
                                size={23}
                            />
                        </div>

                        <div className="profile-security-content">

                            <h3>
                                Your information is
                                secure
                            </h3>

                            <p>
                                Your account information
                                is protected and only
                                accessible to you.
                            </p>

                        </div>

                        <span className="profile-secure-badge">
                            Secure
                        </span>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Profile;
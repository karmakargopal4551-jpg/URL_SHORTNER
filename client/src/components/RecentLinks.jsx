import React, { useState } from "react";

import {
    Link2,
    Copy,
    BarChart3,
    Trash2,
    ExternalLink,
    Check,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const RecentLinks = ({
    links = [],
    onCopy,
    onDelete,
}) => {
    const navigate = useNavigate();

    const [copiedId, setCopiedId] =
        useState(null);

    // ==============================
    // BACKEND URL
    // ==============================

    const getBackendUrl = () => {
        const apiUrl =
            import.meta.env.VITE_API_URL;

        if (!apiUrl) {
            return "http://localhost:5000";
        }

        // Example:
        // http://localhost:5000/api
        //
        // We need:
        // http://localhost:5000

        return apiUrl.replace(/\/api\/?$/, "");
    };

    // ==============================
    // GET SHORT URL
    // ==============================

    const getShortUrl = (link) => {
        if (!link) {
            return "";
        }

        /*
         * IMPORTANT:
         *
         * Always create the short URL using
         * the backend server + shortCode.
         *
         * This prevents the URL from becoming:
         *
         * http://localhost:5173/abc123
         *
         * and instead makes:
         *
         * http://localhost:5000/abc123
         */

        if (link.shortCode) {
            return `${getBackendUrl()}/${link.shortCode}`;
        }

        /*
         * Fallback in case shortCode is missing
         * but backend already provides shortUrl.
         */

        if (link.shortUrl) {
            return link.shortUrl;
        }

        return "";
    };

    // ==============================
    // ANALYTICS
    // ==============================

    const handleAnalytics = (linkId) => {
        if (!linkId) {
            console.error(
                "Link ID is missing"
            );

            return;
        }

        navigate(
            `/analytics/${linkId}`
        );
    };

    // ==============================
    // COPY
    // ==============================

    const handleCopy = async (link) => {
        const shortUrl =
            getShortUrl(link);

        if (!shortUrl) {
            alert(
                "Short URL is not available."
            );

            return;
        }

        try {
            // Modern browsers
            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {
                await navigator.clipboard.writeText(
                    shortUrl
                );
            } else {
                // Fallback
                const textArea =
                    document.createElement(
                        "textarea"
                    );

                textArea.value = shortUrl;

                textArea.style.position =
                    "fixed";

                textArea.style.left =
                    "-999999px";

                textArea.style.top =
                    "-999999px";

                document.body.appendChild(
                    textArea
                );

                textArea.focus();
                textArea.select();

                document.execCommand(
                    "copy"
                );

                document.body.removeChild(
                    textArea
                );
            }

            setCopiedId(link._id);

            if (onCopy) {
                onCopy(shortUrl);
            }

            setTimeout(() => {
                setCopiedId(null);
            }, 2000);

        } catch (error) {
            console.error(
                "Copy failed:",
                error
            );

            alert(
                "Unable to copy the link."
            );
        }
    };

    // ==============================
    // DELETE
    // ==============================

    const handleDelete = (linkId) => {
        if (!linkId) {
            return;
        }

        if (onDelete) {
            onDelete(linkId);
        }
    };

    // ==============================
    // OPEN LINK
    // ==============================

    const handleOpen = (link) => {
        const shortUrl =
            getShortUrl(link);

        if (!shortUrl) {
            alert(
                "Short URL is not available."
            );

            return;
        }

        console.log(
            "Opening short URL:",
            shortUrl
        );

        window.open(
            shortUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="recent-links-card">

            {/* ==============================
                HEADER
            ============================== */}

            <div className="recent-links-header">

                <div>

                    <h3>
                        Recent Links
                    </h3>

                    <p>
                        Your latest shortened URLs
                    </p>

                </div>

                <button
                    className="view-all-btn"
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                    type="button"
                >
                    View All
                </button>

            </div>


            {/* ==============================
                EMPTY STATE
            ============================== */}

            {links.length === 0 ? (

                <div className="recent-empty">

                    <Link2 size={34} />

                    <h4>
                        No links yet
                    </h4>

                    <p>
                        Create your first
                        shortened URL above.
                    </p>

                </div>

            ) : (

                /* ==============================
                    LINKS
                ============================== */

                <div className="recent-links-list">

                    {links
                        .slice(0, 5)
                        .map((link) => {

                            const shortUrl =
                                getShortUrl(
                                    link
                                );

                            return (
                                <div
                                    className="recent-link"
                                    key={
                                        link._id
                                    }
                                >

                                    {/* ==============================
                                        LINK ICON
                                    ============================== */}

                                    <div className="recent-link-icon">

                                        <Link2
                                            size={18}
                                        />

                                    </div>


                                    {/* ==============================
                                        LINK INFORMATION
                                    ============================== */}

                                    <div className="recent-link-info">

                                        <a
                                            href={
                                                shortUrl ||
                                                "#"
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(
                                                e
                                            ) => {

                                                if (
                                                    !shortUrl
                                                ) {
                                                    e.preventDefault();
                                                }

                                            }}
                                        >
                                            {shortUrl ||
                                                link.shortCode ||
                                                "Unavailable"}
                                        </a>

                                        <span>
                                            {
                                                link.originalUrl
                                            }
                                        </span>

                                        <small>
                                            {
                                                link.clicks ||
                                                0
                                            }{" "}
                                            clicks
                                        </small>

                                    </div>


                                    {/* ==============================
                                        ACTIONS
                                    ============================== */}

                                    <div className="recent-link-actions">

                                        {/* COPY */}

                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    link
                                                )
                                            }
                                            title={
                                                copiedId ===
                                                link._id
                                                    ? "Copied!"
                                                    : "Copy"
                                            }
                                            type="button"
                                        >

                                            {copiedId ===
                                            link._id ? (

                                                <Check
                                                    size={17}
                                                />

                                            ) : (

                                                <Copy
                                                    size={17}
                                                />

                                            )}

                                        </button>


                                        {/* ANALYTICS */}

                                        <button
                                            onClick={() =>
                                                handleAnalytics(
                                                    link._id
                                                )
                                            }
                                            title="Analytics"
                                            type="button"
                                        >

                                            <BarChart3
                                                size={17}
                                            />

                                        </button>


                                        {/* DELETE */}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    link._id
                                                )
                                            }
                                            title="Delete"
                                            type="button"
                                        >

                                            <Trash2
                                                size={17}
                                            />

                                        </button>


                                        {/* OPEN */}

                                        <button
                                            onClick={() =>
                                                handleOpen(
                                                    link
                                                )
                                            }
                                            title="Open link"
                                            type="button"
                                        >

                                            <ExternalLink
                                                size={17}
                                            />

                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                </div>

            )}

        </div>
    );
};

export default RecentLinks;
import { useState } from "react";

import {
    Copy,
    Check,
    BarChart3,
    Trash2,
    ExternalLink,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../services/api";
import formatDate from "../utils/formatDate";

const UrlCard = ({ url, onDeleted }) => {
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const shortUrl = `${window.location.protocol}//${window.location.hostname}:5000/${url.shortCode}`;

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(
                shortUrl
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            alert("Unable to copy URL");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this URL?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await api.delete(`/urls/${url._id}`);

            if (onDeleted) {
                onDeleted(url._id);
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Unable to delete URL"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="url-card">
            <div className="url-card-main">
                <div className="url-icon">
                    <ExternalLink size={20} />
                </div>

                <div className="url-details">
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="short-url"
                    >
                        {shortUrl}
                    </a>

                    <p
                        className="original-url"
                        title={url.originalUrl}
                    >
                        {url.originalUrl}
                    </p>

                    <div className="url-meta">
                        <span>
                            {url.clickCount || 0} clicks
                        </span>

                        <span>
                            Created{" "}
                            {formatDate(url.createdAt)}
                        </span>

                        {url.expiresAt && (
                            <span>
                                Expires{" "}
                                {formatDate(
                                    url.expiresAt
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="url-actions">
                <button
                    className="icon-btn"
                    onClick={copyUrl}
                    title="Copy URL"
                >
                    {copied ? (
                        <Check size={18} />
                    ) : (
                        <Copy size={18} />
                    )}
                </button>

                <Link
                    to={`/analytics/${url._id}`}
                    className="icon-btn"
                    title="Analytics"
                >
                    <BarChart3 size={18} />
                </Link>

                <button
                    className="icon-btn delete-btn"
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default UrlCard;
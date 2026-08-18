import { useState } from "react";
import {
    Link as LinkIcon,
    Clock,
    WandSparkles,
} from "lucide-react";

import api from "../services/api";

const UrlForm = ({ onCreated }) => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [customAlias, setCustomAlias] = useState("");
    const [expiration, setExpiration] = useState("never");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!originalUrl.trim()) {
            setError("Please enter a URL.");
            return;
        }

        let expiresAt = null;

        if (expiration !== "never") {
            const date = new Date();

            if (expiration === "1hour") {
                date.setHours(date.getHours() + 1);
            }

            if (expiration === "1day") {
                date.setDate(date.getDate() + 1);
            }

            if (expiration === "7days") {
                date.setDate(date.getDate() + 7);
            }

            if (expiration === "30days") {
                date.setDate(date.getDate() + 30);
            }

            expiresAt = date.toISOString();
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/urls",
                {
                    originalUrl,
                    customAlias:
                        customAlias.trim() || undefined,
                    expiresAt,
                }
            );

            setSuccess(
                "Short URL created successfully!"
            );

            setOriginalUrl("");
            setCustomAlias("");
            setExpiration("never");

            if (onCreated) {
                onCreated(response.data.url);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to create short URL"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="url-form-card">
            <div className="section-heading">
                <div className="section-icon">
                    <WandSparkles size={22} />
                </div>

                <div>
                    <h2>Create Short URL</h2>

                    <p>
                        Turn a long URL into a simple,
                        shareable link.
                    </p>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>Original URL</label>

                <div className="large-input">
                    <LinkIcon size={20} />

                    <input
                        type="url"
                        placeholder="https://example.com/very-long-url"
                        value={originalUrl}
                        onChange={(e) =>
                            setOriginalUrl(
                                e.target.value
                            )
                        }
                        required
                    />
                </div>

                <div className="form-grid">
                    <div>
                        <label>
                            Custom Alias
                        </label>

                        <div className="input-wrapper">
                            <span className="alias-prefix">
                                /
                            </span>

                            <input
                                type="text"
                                placeholder="my-link"
                                value={customAlias}
                                onChange={(e) =>
                                    setCustomAlias(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <small>
                            3–30 characters
                        </small>
                    </div>

                    <div>
                        <label>
                            Expiration
                        </label>

                        <div className="input-wrapper">
                            <Clock size={18} />

                            <select
                                value={expiration}
                                onChange={(e) =>
                                    setExpiration(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="never">
                                    Never
                                </option>

                                <option value="1hour">
                                    1 hour
                                </option>

                                <option value="1day">
                                    1 day
                                </option>

                                <option value="7days">
                                    7 days
                                </option>

                                <option value="30days">
                                    30 days
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="primary-btn create-btn"
                    disabled={loading}
                >
                    <WandSparkles size={18} />

                    {loading
                        ? "Creating..."
                        : "Shorten URL"}
                </button>
            </form>
        </div>
    );
};

export default UrlForm;
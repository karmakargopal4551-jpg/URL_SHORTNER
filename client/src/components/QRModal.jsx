import React, {
    useEffect,
    useState,
} from "react";

import {
    X,
    QrCode,
    Copy,
    Download,
    Link2,
    Check,
} from "lucide-react";

import {
    QRCodeCanvas,
} from "qrcode.react";

import api from "../services/api";

const QRModal = ({ onClose }) => {

    const [links, setLinks] = useState([]);

    const [selectedLink, setSelectedLink] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [copied, setCopied] =
        useState(false);


    // =========================================
    // BACKEND BASE URL
    // =========================================

    const getBackendUrl = () => {

        const apiUrl =
            import.meta.env.VITE_API_URL;

        if (!apiUrl) {
            return "http://localhost:5000";
        }

        return apiUrl
            .replace(/\/api\/?$/, "")
            .replace(/\/$/, "");
    };


    // =========================================
    // GENERATE SHORT URL
    // =========================================

    const getShortUrl = (link) => {

        if (!link) {
            return "";
        }

        // If backend already provides shortUrl
        if (link.shortUrl) {
            return link.shortUrl;
        }

        // Otherwise construct it
        if (link.shortCode) {
            return `${getBackendUrl()}/${link.shortCode}`;
        }

        return "";
    };


    // =========================================
    // FETCH USER LINKS
    // =========================================

    useEffect(() => {

        const fetchLinks = async () => {

            try {

                setLoading(true);

                const response =
                    await api.get("/urls");

                const data =
                    response.data?.urls ||
                    [];

                setLinks(data);

                // Automatically select first link
                if (data.length > 0) {

                    setSelectedLink(
                        data[0]
                    );

                }

            } catch (error) {

                console.error(
                    "Unable to load links:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchLinks();

    }, []);


    // =========================================
    // SELECT DIFFERENT LINK
    // =========================================

    const handleLinkChange = (event) => {

        const selectedId =
            event.target.value;

        const link =
            links.find(
                (item) =>
                    item._id === selectedId
            );

        setSelectedLink(link);

        setCopied(false);
    };


    // =========================================
    // COPY SHORT URL
    // =========================================

    const handleCopy = async () => {

        if (!selectedLink) {
            return;
        }

        const shortUrl =
            getShortUrl(
                selectedLink
            );

        if (!shortUrl) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                shortUrl
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

        }

    };


    // =========================================
    // DOWNLOAD QR
    // =========================================

    const handleDownload = () => {

        if (!selectedLink) {
            return;
        }

        const canvas =
            document.getElementById(
                "shortly-qr-code"
            );

        if (!canvas) {
            return;
        }

        const pngUrl =
            canvas.toDataURL(
                "image/png"
            );

        const downloadLink =
            document.createElement(
                "a"
            );

        downloadLink.href =
            pngUrl;

        downloadLink.download =
            `shortly-qr-${
                selectedLink.shortCode ||
                "code"
            }.png`;

        document.body.appendChild(
            downloadLink
        );

        downloadLink.click();

        document.body.removeChild(
            downloadLink
        );

    };


    // =========================================
    // ESCAPE KEY
    // =========================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (
                event.key ===
                "Escape"
            ) {
                onClose();
            }

        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [onClose]);


    // =========================================
    // MODAL
    // =========================================

    return (

        <div
            className="qr-modal-overlay"
            onClick={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div className="qr-modal">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="qr-modal-header">

                    <div className="qr-modal-title">

                        <div className="qr-modal-icon">

                            <QrCode
                                size={22}
                            />

                        </div>

                        <div>

                            <h2>
                                QR Code Generator
                            </h2>

                            <p>
                                Generate a QR code
                                for your short link
                            </p>

                        </div>

                    </div>


                    <button
                        className="qr-modal-close"
                        onClick={onClose}
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* =================================
                    BODY
                ================================= */}

                <div className="qr-modal-body">

                    {/* =================================
                        LOADING
                    ================================= */}

                    {loading && (

                        <div className="qr-loading">

                            <div className="qr-spinner" />

                            <p>
                                Loading your links...
                            </p>

                        </div>

                    )}


                    {/* =================================
                        NO LINKS
                    ================================= */}

                    {!loading &&
                        links.length === 0 && (

                            <div className="qr-empty">

                                <QrCode
                                    size={42}
                                />

                                <h3>
                                    No short links yet
                                </h3>

                                <p>
                                    Create a shortened
                                    URL first to
                                    generate a QR code.
                                </p>

                            </div>

                        )}


                    {/* =================================
                        LINKS AVAILABLE
                    ================================= */}

                    {!loading &&
                        links.length > 0 &&
                        selectedLink && (

                            <>

                                {/* SELECT LINK */}

                                <div className="qr-form-group">

                                    <label>
                                        Select a short link
                                    </label>

                                    <div className="qr-select-wrapper">

                                        <Link2
                                            size={18}
                                        />

                                        <select
                                            value={
                                                selectedLink?._id ||
                                                ""
                                            }
                                            onChange={
                                                handleLinkChange
                                            }
                                        >

                                            {links.map(
                                                (link) => (

                                                    <option
                                                        key={
                                                            link._id
                                                        }
                                                        value={
                                                            link._id
                                                        }
                                                    >
                                                        {
                                                            getShortUrl(
                                                                link
                                                            )
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>


                                {/* QR CODE */}

                                <div className="qr-code-container">

                                    <QRCodeCanvas
                                        id="shortly-qr-code"
                                        value={getShortUrl(
                                            selectedLink
                                        )}
                                        size={210}
                                        bgColor="#ffffff"
                                        fgColor="#111827"
                                        level="H"
                                        includeMargin={true}
                                    />

                                </div>


                                {/* SHORT URL */}

                                <div className="qr-short-url">

                                    <span>
                                        Short URL
                                    </span>

                                    <strong>
                                        {
                                            getShortUrl(
                                                selectedLink
                                            )
                                        }
                                    </strong>

                                </div>


                                {/* ORIGINAL URL */}

                                <div className="qr-original-url">

                                    <span>
                                        Original URL
                                    </span>

                                    <p>
                                        {
                                            selectedLink.originalUrl
                                        }
                                    </p>

                                </div>


                                {/* ACTION BUTTONS */}

                                <div className="qr-actions">

                                    <button
                                        className="qr-copy-btn"
                                        onClick={
                                            handleCopy
                                        }
                                    >

                                        {copied ? (

                                            <>
                                                <Check
                                                    size={17}
                                                />

                                                Copied
                                            </>

                                        ) : (

                                            <>
                                                <Copy
                                                    size={17}
                                                />

                                                Copy Link
                                            </>

                                        )}

                                    </button>


                                    <button
                                        className="qr-download-btn"
                                        onClick={
                                            handleDownload
                                        }
                                    >

                                        <Download
                                            size={17}
                                        />

                                        Download QR

                                    </button>

                                </div>

                            </>

                        )}

                </div>

            </div>

        </div>

    );
};

export default QRModal;
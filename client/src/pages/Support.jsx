import React from "react";

import {
    CircleHelp,
    Mail,
    MessageCircle,
    Heart,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

const Support = () => {
    const [mobileOpen, setMobileOpen] =
        React.useState(false);

    // ==============================
    // CONTACT DETAILS
    // ==============================

    const supportEmail =
        "anandagopalkarmakar@gmail.com";

    const whatsappNumber =
        "917872681376";

    // ==============================
    // WHATSAPP SUPPORT
    // ==============================

    const openWhatsApp = () => {
        const message = encodeURIComponent(
            "Hello, I need help with my Shortly account."
        );

        window.open(
            `https://wa.me/${whatsappNumber}?text=${message}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // ==============================
    // DONATION
    // ==============================

    const openDonation = () => {
        window.dispatchEvent(
            new Event("open-donation")
        );
    };

    // ==============================
    // GMAIL SUPPORT
    // ==============================

    const openEmailSupport = () => {
        const subject = encodeURIComponent(
            "Shortly Support Request"
        );

        const body = encodeURIComponent(
            "Hello, I need help with my Shortly account."
        );

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${subject}&body=${body}`;

        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // ==============================
    // GMAIL FEEDBACK
    // ==============================

    const openFeedback = () => {
        const subject = encodeURIComponent(
            "Shortly Feedback"
        );

        const body = encodeURIComponent(
            "Hello, I would like to share some feedback about Shortly."
        );

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${subject}&body=${body}`;

        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="dashboard-layout">

            {/* ==============================
                SIDEBAR
            ============================== */}

            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* ==============================
                MAIN CONTENT
            ============================== */}

            <main className="dashboard-main">

                <header className="dashboard-topbar">
                    <div className="topbar-spacer" />
                </header>

                <div className="dashboard-content">

                    {/* ==============================
                        PAGE HEADER
                    ============================== */}

                    <div className="dashboard-heading">

                        <div>

                            <p className="analytics-eyebrow">
                                SUPPORT
                            </p>

                            <h1>
                                How can we help?
                            </h1>

                            <p>
                                Get help with your
                                Shortly account and
                                links.
                            </p>

                        </div>

                    </div>

                    {/* ==============================
                        SUPPORT GRID
                    ============================== */}

                    <div className="support-page-grid">

                        {/* ==============================
                            HELP CENTER / WHATSAPP
                        ============================== */}

                        <div className="support-page-card">

                            <div className="support-page-icon">
                                <CircleHelp
                                    size={25}
                                />
                            </div>

                            <h3>
                                Help Center
                            </h3>

                            <p>
                                Need quick help?
                                Contact me directly
                                on WhatsApp and ask
                                your query.
                            </p>

                            <button
                                className="support-page-button"
                                onClick={openWhatsApp}
                            >
                                <MessageCircle
                                    size={17}
                                />

                                WhatsApp Support
                            </button>

                        </div>

                        {/* ==============================
                            EMAIL SUPPORT
                        ============================== */}

                        <div className="support-page-card">

                            <div className="support-page-icon">
                                <Mail size={25} />
                            </div>

                            <h3>
                                Email Support
                            </h3>

                            <p>
                                Send me an email if
                                you need additional
                                assistance with
                                Shortly.
                            </p>

                            <button
                                className="support-page-button"
                                onClick={
                                    openEmailSupport
                                }
                            >
                                <Mail size={17} />

                                Contact Support
                            </button>

                        </div>

                        {/* ==============================
                            FEEDBACK
                        ============================== */}

                        <div className="support-page-card">

                            <div className="support-page-icon">
                                <MessageCircle
                                    size={25}
                                />
                            </div>

                            <h3>
                                Feedback
                            </h3>

                            <p>
                                Have an idea or
                                suggestion? Tell me
                                how I can make Shortly
                                better.
                            </p>

                            <button
                                className="support-page-button"
                                onClick={openFeedback}
                            >
                                <Mail size={17} />

                                Send Feedback
                            </button>

                        </div>

                        {/* ==============================
                            DONATION
                        ============================== */}

                        <div className="support-page-card">

                            <div className="support-page-icon">
                                <Heart
                                    size={25}
                                    fill="currentColor"
                                />
                            </div>

                            <h3>
                                Support Shortly
                            </h3>

                            <p>
                                Help me maintain the
                                platform and add new
                                features.
                            </p>

                            <button
                                className="support-page-button"
                                onClick={openDonation}
                            >
                                <Heart
                                    size={17}
                                    fill="currentColor"
                                />

                                Donate
                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Support;
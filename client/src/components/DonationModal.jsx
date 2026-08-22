import React, {
    useEffect,
    useState,
} from "react";

import {
    Heart,
    Lock,
    Check,
    X,
} from "lucide-react";

import api from "../services/api";

const DonationModal = () => {
    const [isOpen, setIsOpen] =
        useState(false);

    const [amount, setAmount] =
        useState(100);

    const [customAmount, setCustomAmount] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const presetAmounts = [
        50,
        100,
        200,
        500,
    ];

    // =====================================
    // LISTEN FOR DONATION EVENT
    // =====================================

    useEffect(() => {
        const openDonation = () => {
            setIsOpen(true);
        };

        window.addEventListener(
            "open-donation",
            openDonation
        );

        return () => {
            window.removeEventListener(
                "open-donation",
                openDonation
            );
        };
    }, []);

    // =====================================
    // CLOSE MODAL
    // =====================================

    const closeModal = () => {
        if (loading) return;

        setIsOpen(false);
        setCustomAmount("");
        setAmount(100);
    };

    // =====================================
    // CLOSE WHEN CLICKING BACKDROP
    // =====================================

    const handleBackdropClick = (e) => {
        if (
            e.target === e.currentTarget &&
            !loading
        ) {
            closeModal();
        }
    };

    // =====================================
    // ESC KEY
    // =====================================

    useEffect(() => {
        const handleEscape = (e) => {
            if (
                e.key === "Escape" &&
                isOpen &&
                !loading
            ) {
                closeModal();
            }
        };

        window.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, loading]);

    // =====================================
    // GET DONATION AMOUNT
    // =====================================

    const getDonationAmount = () => {
        if (customAmount) {
            return Number(customAmount);
        }

        return amount;
    };

    // =====================================
    // HANDLE DONATION
    // =====================================

    const handleDonation = async () => {
        const donationAmount =
            getDonationAmount();

        if (
            !donationAmount ||
            donationAmount < 1
        ) {
            alert(
                "Please enter a valid donation amount."
            );

            return;
        }

        try {
            setLoading(true);

            const response =
                await api.post(
                    "/payments/donation/create-order",
                    {
                        amount:
                            donationAmount,
                    }
                );

            const {
                order,
                keyId,
            } = response.data;

            const options = {
                key: keyId,

                amount: order.amount,

                currency:
                    order.currency,

                name: "Shortly",

                description:
                    "Support Shortly",

                order_id: order.id,

                handler:
                    async function (
                        paymentResponse
                    ) {
                        try {
                            const verifyResponse =
                                await api.post(
                                    "/payments/donation/verify",
                                    paymentResponse
                                );

                            if (
                                verifyResponse
                                    .data
                                    .success
                            ) {
                                alert(
                                    "❤️ Thank you for supporting Shortly!"
                                );

                                closeModal();
                            }
                        } catch (error) {
                            alert(
                                error.response
                                    ?.data
                                    ?.message ||
                                    "Donation verification failed."
                            );
                        }
                    },

                theme: {
                    color: "#ec4899",
                },
            };

            // =================================
            // CHECK RAZORPAY
            // =================================

            if (!window.Razorpay) {
                alert(
                    "Razorpay SDK is not loaded."
                );

                return;
            }

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.on(
                "payment.failed",
                () => {
                    alert(
                        "Donation payment failed. Please try again."
                    );
                }
            );

            razorpay.open();
        } catch (error) {
            console.error(
                "Donation error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                    "Unable to create donation order."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // DON'T RENDER IF CLOSED
    // =====================================

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="donation-modal-overlay"
            onClick={
                handleBackdropClick
            }
        >
            <div className="donation-modal">

                {/* ==========================
                    CLOSE BUTTON
                ========================== */}

                <button
                    className="donation-modal-close"
                    onClick={closeModal}
                    disabled={loading}
                >
                    <X size={20} />
                </button>

                {/* ==========================
                    HEADER
                ========================== */}

                <div className="donation-modal-header">

                    <div className="donation-modal-heart">
                        <Heart
                            size={28}
                            fill="currentColor"
                        />
                    </div>

                    <div>
                        <h2>
                            Support Shortly ❤️
                        </h2>

                        <p>
                            Help us keep Shortly
                            growing.
                        </p>
                    </div>

                </div>

                {/* ==========================
                    DESCRIPTION
                ========================== */}

                <p className="donation-modal-description">
                    Your support helps us maintain
                    the platform, add new features
                    and improve Shortly.
                </p>

                {/* ==========================
                    BENEFITS
                ========================== */}

                <div className="donation-modal-benefits">

                    <div>
                        <Check size={16} />
                        Keep improving Shortly
                    </div>

                    <div>
                        <Check size={16} />
                        Add powerful features
                    </div>

                    <div>
                        <Check size={16} />
                        Support development
                    </div>

                </div>

                {/* ==========================
                    AMOUNTS
                ========================== */}

                <div className="donation-modal-label">
                    Choose donation amount
                </div>

                <div className="donation-presets">

                    {presetAmounts.map(
                        (preset) => (
                            <button
                                key={preset}
                                className={
                                    amount ===
                                        preset &&
                                    !customAmount
                                        ? "donation-active"
                                        : ""
                                }
                                onClick={() => {
                                    setAmount(
                                        preset
                                    );

                                    setCustomAmount(
                                        ""
                                    );
                                }}
                                disabled={
                                    loading
                                }
                            >
                                ₹{preset}
                            </button>
                        )
                    )}

                    <button
                        className={
                            customAmount
                                ? "donation-active"
                                : ""
                        }
                        onClick={() =>
                            setCustomAmount(
                                customAmount ||
                                    "100"
                            )
                        }
                        disabled={loading}
                    >
                        Custom
                    </button>

                </div>

                {/* ==========================
                    CUSTOM AMOUNT
                ========================== */}

                {customAmount && (
                    <div className="custom-donation">
                        <span>₹</span>

                        <input
                            type="number"
                            min="1"
                            value={
                                customAmount
                            }
                            onChange={(e) =>
                                setCustomAmount(
                                    e.target.value
                                )
                            }
                            placeholder="Enter amount"
                            disabled={
                                loading
                            }
                        />
                    </div>
                )}

                {/* ==========================
                    DONATE BUTTON
                ========================== */}

                <button
                    className="donate-button"
                    onClick={
                        handleDonation
                    }
                    disabled={loading}
                >
                    <Heart
                        size={19}
                        fill="currentColor"
                    />

                    {loading
                        ? "Processing..."
                        : `Donate ₹${getDonationAmount()}`}
                </button>

                {/* ==========================
                    SECURITY
                ========================== */}

                <div className="secure-donation">
                    <Lock size={13} />

                    Secure payment powered by
                    Razorpay
                </div>

            </div>
        </div>
    );
};

export default DonationModal;
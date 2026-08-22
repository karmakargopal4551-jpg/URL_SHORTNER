import React, { useEffect, useState } from "react";

import {
    X,
    Check,
    CreditCard,
    Sparkles,
} from "lucide-react";

import api from "../services/api";

const UpgradeModal = ({
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            // ==============================
            // CREATE PAYMENT ORDER
            // ==============================

            const response = await api.post(
                "/payments/create-order"
            );

            const {
                order,
                keyId,
            } = response.data;

            // ==============================
            // CHECK RAZORPAY
            // ==============================

            if (!window.Razorpay) {
                alert(
                    "Razorpay SDK is not loaded. Please refresh the page."
                );

                return;
            }

            // ==============================
            // RAZORPAY OPTIONS
            // ==============================

            const options = {
                key: keyId,

                amount: order.amount,

                currency: order.currency,

                name: "Shortly",

                description:
                    "Shortly Pro - 1 Month",

                order_id: order.id,

                prefill: {
                    name: "",
                    email: "",
                },

                theme: {
                    color: "#635bff",
                },

                handler: async (
                    paymentResponse
                ) => {
                    try {
                        const verifyResponse =
                            await api.post(
                                "/payments/verify",
                                paymentResponse
                            );

                        if (
                            verifyResponse.data
                                .success
                        ) {
                            alert(
                                "🎉 Payment successful! You are now a Pro user."
                            );

                            if (onSuccess) {
                                onSuccess();
                            }

                            onClose();
                        }
                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            error.response
                                ?.data?.message ||
                                "Payment verification failed."
                        );
                    }
                },

                modal: {
                    ondismiss: () => {
                        console.log(
                            "Payment window closed"
                        );
                    },
                },
            };

            // ==============================
            // OPEN RAZORPAY
            // ==============================

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.on(
                "payment.failed",
                (response) => {
                    console.error(
                        "Payment failed:",
                        response.error
                    );

                    alert(
                        "Payment failed. Please try again."
                    );
                }
            );

            razorpay.open();
        } catch (error) {
            console.error(
                "Payment error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                    "Unable to start payment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">

            <div className="upgrade-modal">

                {/* Close */}

                <button
                    className="modal-close"
                    onClick={onClose}
                    type="button"
                >
                    <X size={20} />
                </button>

                {/* Icon */}

                <div className="upgrade-icon">
                    <Sparkles size={28} />
                </div>

                {/* Title */}

                <h2>
                    Upgrade to Shortly Pro
                </h2>

                <p className="upgrade-description">
                    Unlock more powerful features
                    and remove advertisements.
                </p>

                {/* Price */}

                <div className="price">
                    ₹1

                    <span>
                        / month
                    </span>
                </div>

                {/* Features */}

                <div className="pro-features">

                    <div>
                        <Check size={18} />
                        Unlimited short links
                    </div>

                    <div>
                        <Check size={18} />
                        Advanced analytics
                    </div>

                    <div>
                        <Check size={18} />
                        No advertisements
                    </div>

                    <div>
                        <Check size={18} />
                        QR code generation
                    </div>

                    <div>
                        <Check size={18} />
                        Premium features
                    </div>

                </div>

                {/* Payment */}

                <button
                    className="pay-btn"
                    onClick={handlePayment}
                    disabled={loading}
                    type="button"
                >
                    <CreditCard size={19} />

                    {loading
                        ? "Processing..."
                        : "Pay ₹1"}
                </button>

                {/* Security */}

                <p className="secure-payment">
                    🔒 Secure payment powered by
                    Razorpay
                </p>

            </div>

        </div>
    );
};

export default UpgradeModal;
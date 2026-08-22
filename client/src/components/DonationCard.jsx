import React, {
    useEffect,
    useState,
} from "react";

import {
    Heart,
    Lock,
    Check,
} from "lucide-react";

import api from "../services/api";

const DonationCard = () => {
    const [amount, setAmount] = useState(100);
    const [customAmount, setCustomAmount] =
        useState("");

    const [loading, setLoading] = useState(false);

    const presetAmounts = [
        50,
        100,
        200,
        500,
    ];

    const getDonationAmount = () => {
        if (customAmount) {
            return Number(customAmount);
        }

        return amount;
    };

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

            const response = await api.post(
                "/payments/donation/create-order",
                {
                    amount: donationAmount,
                }
            );

            const {
                order,
                keyId,
            } = response.data;

            const options = {
                key: keyId,

                amount: order.amount,

                currency: order.currency,

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

            if (!window.Razorpay) {
                alert(
                    "Razorpay SDK is not loaded."
                );

                return;
            }

            const razorpay =
                new window.Razorpay(options);

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
                error.response?.data?.message ||
                    "Unable to create donation order."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donation-card">
            <div className="donation-heading">
                <div className="donation-heart">
                    <Heart
                        size={24}
                        fill="currentColor"
                    />
                </div>

                <div>
                    <h3>
                        Support Shortly ❤️
                    </h3>

                    <p>
                        Help us keep improving
                        Shortly.
                    </p>
                </div>
            </div>

            <p className="donation-description">
                Your support helps us maintain the
                platform, add new features and keep
                Shortly growing.
            </p>

            <div className="donation-benefits">
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
                >
                    Custom
                </button>
            </div>

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
                    />
                </div>
            )}

            <button
                className="donate-button"
                onClick={handleDonation}
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

            <div className="secure-donation">
                <Lock size={13} />

                Secure payment powered by
                Razorpay
            </div>
        </div>
    );
};

export default DonationCard;
import crypto from "crypto";
import Razorpay from "razorpay";

import User from "../models/user.js";
import Payment from "../models/payment.js";

// ==========================================
// RAZORPAY INSTANCE
// ==========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// CREATE PRO PAYMENT ORDER
// ==========================================

export const createOrder = async (req, res) => {
    try {
        console.log("--------------------------------");
        console.log(
            "Creating Razorpay payment order..."
        );

        console.log(
            "Razorpay Key ID:",
            process.env.RAZORPAY_KEY_ID
                ? "Loaded"
                : "Missing"
        );

        console.log(
            "Razorpay Key Secret:",
            process.env.RAZORPAY_KEY_SECRET
                ? "Loaded"
                : "Missing"
        );

        // Authentication check
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const userId =
            req.user._id || req.user.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid user authentication",
            });
        }

        // ₹1 = 100 paise
        const amount = 100;

        const order =
            await razorpay.orders.create({
                amount,
                currency: "INR",

                receipt:
                    `shortly_${Date.now()}`,

                notes: {
                    userId: userId.toString(),
                    plan: "pro",
                    duration: "1 month",
                },
            });

        console.log(
            "Razorpay order created:",
            order.id
        );

        // Save payment
        if (Payment) {
            await Payment.create({
                user: userId,

                razorpayOrderId:
                    order.id,

                amount:
                    order.amount,

                currency:
                    order.currency,

                plan: "pro",

                status: "created",
            });
        }

        return res.status(200).json({
            success: true,

            message:
                "Payment order created successfully",

            order: {
                id: order.id,

                amount:
                    order.amount,

                currency:
                    order.currency,
            },

            keyId:
                process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error(
            "================================"
        );

        console.error(
            "RAZORPAY ORDER CREATION ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Description:",
            error?.error?.description
        );

        console.error(
            "Code:",
            error?.error?.code
        );

        console.error(
            "Full Error:",
            error
        );

        console.error(
            "================================"
        );

        return res.status(500).json({
            success: false,

            message:
                error?.error?.description ||
                error?.description ||
                error.message ||
                "Unable to create payment order",
        });
    }
};

// ==========================================
// VERIFY PRO PAYMENT
// ==========================================

export const verifyPayment = async (
    req,
    res
) => {
    try {
        console.log(
            "Verifying Razorpay payment..."
        );

        // Authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });
        }

        const userId =
            req.user._id || req.user.id;

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,

                message:
                    "Incomplete payment information",
            });
        }

        const payment =
            await Payment.findOne({
                razorpayOrderId:
                    razorpay_order_id,

                user: userId,
            });

        if (!payment) {
            return res.status(404).json({
                success: false,

                message:
                    "Payment order not found",
            });
        }

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env
                        .RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                        "|" +
                        razorpay_payment_id
                )
                .digest("hex");

        const generatedBuffer =
            Buffer.from(
                generatedSignature,
                "hex"
            );

        const receivedBuffer =
            Buffer.from(
                razorpay_signature,
                "hex"
            );

        if (
            generatedBuffer.length !==
            receivedBuffer.length
        ) {
            return res.status(400).json({
                success: false,

                message:
                    "Invalid payment signature",
            });
        }

        const isSignatureValid =
            crypto.timingSafeEqual(
                generatedBuffer,
                receivedBuffer
            );

        if (!isSignatureValid) {
            return res.status(400).json({
                success: false,

                message:
                    "Invalid payment signature",
            });
        }

        // Update payment
        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.razorpaySignature =
            razorpay_signature;

        payment.status = "paid";

        await payment.save();

        // Find user
        const user =
            await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,

                message:
                    "User not found",
            });
        }

        // One month subscription
        const expiresAt =
            new Date();

        expiresAt.setMonth(
            expiresAt.getMonth() + 1
        );

        user.subscription = {
            plan: "pro",

            status: "active",

            expiresAt,
        };

        await user.save();

        console.log(
            "Payment verified successfully"
        );

        console.log(
            "User upgraded to Pro:",
            user.email
        );

        return res.status(200).json({
            success: true,

            message:
                "Payment successful! You are now a Pro user.",

            subscription:
                user.subscription,
        });
    } catch (error) {
        console.error(
            "PAYMENT VERIFICATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                error.message ||
                "Payment verification failed",
        });
    }
};

// ==========================================
// CREATE DONATION ORDER
// ==========================================

export const createDonationOrder =
    async (req, res) => {
        try {
            console.log(
                "Creating donation order..."
            );

            const { amount } = req.body;

            if (
                !amount ||
                Number(amount) < 1
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Donation amount must be at least ₹1.",
                });
            }

            const donationAmount =
                Math.round(
                    Number(amount) * 100
                );

            const options = {
                amount:
                    donationAmount,

                currency: "INR",

                receipt:
                    `donation_${Date.now()}`,

                notes: {
                    type: "donation",

                    platform: "Shortly",
                },
            };

            const order =
                await razorpay.orders.create(
                    options
                );

            console.log(
                "Donation order created:",
                order.id
            );

            return res.status(200).json({
                success: true,

                order,

                keyId:
                    process.env
                        .RAZORPAY_KEY_ID,
            });
        } catch (error) {
            console.error(
                "Donation order creation failed:"
            );

            console.error(error);

            return res.status(500).json({
                success: false,

                message:
                    error?.error
                        ?.description ||
                    error?.message ||
                    "Unable to create donation order.",
            });
        }
    };

// ==========================================
// VERIFY DONATION
// ==========================================

export const verifyDonation =
    async (req, res) => {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            } = req.body;

            if (
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Incomplete payment information.",
                });
            }

            const generatedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env
                            .RAZORPAY_KEY_SECRET
                    )
                    .update(
                        `${razorpay_order_id}|${razorpay_payment_id}`
                    )
                    .digest("hex");

            if (
                generatedSignature !==
                razorpay_signature
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid payment signature.",
                });
            }

            console.log(
                "Donation payment verified:",
                razorpay_payment_id
            );

            return res.status(200).json({
                success: true,

                message:
                    "Donation payment successful. Thank you for supporting Shortly ❤️",
            });
        } catch (error) {
            console.error(
                "Donation verification failed:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Donation verification failed.",
            });
        }
    };
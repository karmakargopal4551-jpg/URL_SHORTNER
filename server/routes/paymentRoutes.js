import express from "express";

import {
    createOrder,
    verifyPayment,
    createDonationOrder,
    verifyDonation,
} from "../controllers/paymentController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// PRO PAYMENT
// ==========================================

// Create Pro payment order
router.post(
    "/create-order",
    protect,
    createOrder
);

// Verify Pro payment
router.post(
    "/verify",
    protect,
    verifyPayment
);

// ==========================================
// DONATION PAYMENT
// ==========================================

// Donation order
// Login is NOT required
router.post(
    "/donation/create-order",
    createDonationOrder
);

// Donation verification
// Login is NOT required
router.post(
    "/donation/verify",
    verifyDonation
);

export default router;
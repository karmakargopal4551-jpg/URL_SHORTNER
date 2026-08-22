import express from "express";

import {
    register,
    login,
    verifyEmail,
    resendVerificationCode,
    updateProfile,
    changePassword,
} from "../controllers/authController.js";

import protect from "../middleware/auth.js";

const router = express.Router();


// =========================================
// PUBLIC AUTH ROUTES
// =========================================

router.post(
    "/register",
    register
);


router.post(
    "/login",
    login
);


// =========================================
// EMAIL VERIFICATION
// =========================================

router.post(
    "/verify-email",
    verifyEmail
);


router.post(
    "/resend-verification",
    resendVerificationCode
);


// =========================================
// PROTECTED PROFILE
// =========================================

router.put(
    "/profile",
    protect,
    updateProfile
);


// =========================================
// CHANGE PASSWORD
// =========================================

router.put(
    "/change-password",
    protect,
    changePassword
);


export default router;
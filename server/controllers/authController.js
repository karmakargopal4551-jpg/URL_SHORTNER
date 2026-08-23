import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

import {
    sendVerificationEmail,
} from "../services/emailService.js";


// =========================================
// GENERATE JWT
// =========================================

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};


// =========================================
// GENERATE VERIFICATION CODE
// =========================================

const generateVerificationCode = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};


// =========================================
// GET FRONTEND URL
// =========================================

const getFrontendUrl = () => {
    return (
        process.env.CLIENT_URL ||
        process.env.FRONTEND_URL ||
        "http://localhost:5173"
    ).replace(/\/$/, "");
};


// =========================================
// REGISTER
// =========================================

export const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
        } = req.body;


        // =========================================
        // VALIDATION
        // =========================================

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required",
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();

        const trimmedName =
            name.trim();


        // =========================================
        // CHECK EXISTING USER
        // =========================================

        const existingUser =
            await User.findOne({
                email: normalizedEmail,
            });


        // =========================================
        // EXISTING USER
        // =========================================

        if (existingUser) {

            // Already verified
            if (existingUser.isEmailVerified) {

                return res.status(409).json({
                    success: false,
                    message:
                        "User already exists",
                });

            }


            // =========================================
            // EXISTING USER BUT NOT VERIFIED
            // =========================================

            const verificationCode =
                generateVerificationCode();

            const verificationCodeExpires =
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                );


            existingUser.name =
                trimmedName;

            existingUser.password =
                await bcrypt.hash(
                    password,
                    10
                );

            existingUser.verificationCode =
                verificationCode;

            existingUser.verificationCodeExpires =
                verificationCodeExpires;


            await existingUser.save();


            // =========================================
            // VERIFICATION LINK
            // =========================================

            const verificationLink =
                `${getFrontendUrl()}/verify-email?email=${encodeURIComponent(
                    existingUser.email
                )}&code=${verificationCode}`;


            // =========================================
            // SEND EMAIL
            // =========================================

            try {

                await sendVerificationEmail(
                    existingUser.email,
                    existingUser.name,
                    verificationCode,
                    verificationLink
                );

            } catch (emailError) {

                console.error(
                    "Verification email error:",
                    emailError
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to send verification email. Please try again.",
                });

            }


            return res.status(200).json({
                success: true,
                requiresVerification: true,
                message:
                    "Verification code sent to your email",
                email:
                    existingUser.email,
            });

        }


        // =========================================
        // HASH PASSWORD
        // =========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // =========================================
        // GENERATE OTP
        // =========================================

        const verificationCode =
            generateVerificationCode();

        const verificationCodeExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        // =========================================
        // CREATE USER
        // =========================================

        const user =
            await User.create({

                name: trimmedName,

                email:
                    normalizedEmail,

                password:
                    hashedPassword,

                isEmailVerified:
                    false,

                verificationCode,

                verificationCodeExpires,

            });


        // =========================================
        // VERIFICATION LINK
        // =========================================

        const verificationLink =
            `${getFrontendUrl()}/verify-email?email=${encodeURIComponent(
                user.email
            )}&code=${verificationCode}`;


        // =========================================
        // SEND VERIFICATION EMAIL
        // =========================================

        try {

            await sendVerificationEmail(
                user.email,
                user.name,
                verificationCode,
                verificationLink
            );

        } catch (emailError) {

            console.error(
                "Verification email error:",
                emailError
            );


            // Remove account if email couldn't be sent
            await User.findByIdAndDelete(
                user._id
            );


            return res.status(500).json({
                success: false,
                message:
                    "Unable to send verification email. Please try again.",
            });

        }


        // =========================================
        // RESPONSE
        // =========================================

        return res.status(201).json({

            success: true,

            requiresVerification:
                true,

            message:
                "Verification code sent to your email",

            email:
                user.email,

        });


    } catch (error) {

        console.error(
            "Register error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error",

        });

    }

};


// =========================================
// VERIFY EMAIL
// =========================================

export const verifyEmail = async (req, res) => {

    try {

        const {
            email,
            verificationCode,
        } = req.body;


        if (!email || !verificationCode) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and verification code are required",

            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // =========================================
        // FIND USER
        // =========================================

        const user =
            await User.findOne({
                email: normalizedEmail,
            }).select(
                "+verificationCode +verificationCodeExpires +password"
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        // =========================================
        // ALREADY VERIFIED
        // =========================================

        if (user.isEmailVerified) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is already verified",

            });

        }


        // =========================================
        // CHECK OTP
        // =========================================

        if (
            user.verificationCode !==
            verificationCode.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid verification code",

            });

        }


        // =========================================
        // CHECK EXPIRATION
        // =========================================

        if (
            !user.verificationCodeExpires ||
            user.verificationCodeExpires <
            new Date()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Verification code has expired. Please request a new code.",

            });

        }


        // =========================================
        // VERIFY USER
        // =========================================

        user.isEmailVerified =
            true;

        user.verificationCode =
            null;

        user.verificationCodeExpires =
            null;


        await user.save();


        // =========================================
        // GENERATE TOKEN
        // =========================================

        const token =
            generateToken(
                user._id
            );


        return res.status(200).json({

            success: true,

            message:
                "Email verified successfully",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

            },

        });


    } catch (error) {

        console.error(
            "Verify email error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to verify email",

        });

    }

};


// =========================================
// RESEND VERIFICATION CODE
// =========================================

export const resendVerificationCode =
    async (req, res) => {

        try {

            const {
                email,
            } = req.body;


            if (!email) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is required",

                });

            }


            const normalizedEmail =
                email.trim().toLowerCase();


            const user =
                await User.findOne({
                    email: normalizedEmail,
                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found",

                });

            }


            // =========================================
            // ALREADY VERIFIED
            // =========================================

            if (user.isEmailVerified) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is already verified",

                });

            }


            // =========================================
            // GENERATE NEW OTP
            // =========================================

            const verificationCode =
                generateVerificationCode();

            const verificationCodeExpires =
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                );


            user.verificationCode =
                verificationCode;

            user.verificationCodeExpires =
                verificationCodeExpires;


            await user.save();


            // =========================================
            // VERIFICATION LINK
            // =========================================

            const verificationLink =
                `${getFrontendUrl()}/verify-email?email=${encodeURIComponent(
                    user.email
                )}&code=${verificationCode}`;


            // =========================================
            // SEND EMAIL
            // =========================================

            await sendVerificationEmail(
                user.email,
                user.name,
                verificationCode,
                verificationLink
            );


            return res.status(200).json({

                success: true,

                message:
                    "A new verification code has been sent",

            });


        } catch (error) {

            console.error(
                "Resend verification error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to resend verification code",

            });

        }

    };


// =========================================
// LOGIN
// =========================================

export const login = async (req, res) => {

    try {

        const {
            email,
            password,
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required",

            });

        }


        const user =
            await User.findOne({

                email:
                    email
                        .trim()
                        .toLowerCase(),

            }).select("+password");


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password",

            });

        }


        // =========================================
        // EMAIL VERIFICATION CHECK
        // =========================================

        if (!user.isEmailVerified) {

            return res.status(403).json({

                success: false,

                requiresVerification:
                    true,

                email:
                    user.email,

                message:
                    "Please verify your email before logging in",

            });

        }


        // =========================================
        // PASSWORD CHECK
        // =========================================

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password",

            });

        }


        // =========================================
        // JWT
        // =========================================

        const token =
            generateToken(
                user._id
            );


        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

            },

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error",

        });

    }

};


// =========================================
// UPDATE PROFILE
// =========================================

export const updateProfile = async (
    req,
    res
) => {

    try {

        const {
            name,
        } = req.body;


        if (
            !name ||
            !name.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required",

            });

        }


        const trimmedName =
            name.trim();


        if (
            trimmedName.length < 2
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name must be at least 2 characters",

            });

        }


        if (
            trimmedName.length > 50
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name cannot exceed 50 characters",

            });

        }


        const user =
            await User.findById(
                req.user._id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        user.name =
            trimmedName;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                subscription:
                    user.subscription,

            },

        });


    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update profile",

        });

    }

};


// =========================================
// CHANGE PASSWORD
// =========================================

export const changePassword = async (
    req,
    res
) => {

    try {

        const {
            currentPassword,
            newPassword,
        } = req.body;


        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password and new password are required",

            });

        }


        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 6 characters",

            });

        }


        const user =
            await User.findById(
                req.user._id
            ).select(
                "+password"
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Current password is incorrect",

            });

        }


        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );


        if (isSamePassword) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from current password",

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        user.password =
            hashedPassword;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password changed successfully",

        });


    } catch (error) {

        console.error(
            "Change password error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to change password",

        });

    }

};
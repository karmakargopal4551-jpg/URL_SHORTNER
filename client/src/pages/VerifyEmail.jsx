import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    MailCheck,
    ShieldCheck,
    Link as LinkIcon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


const VerifyEmail = () => {

    const navigate =
        useNavigate();


    const [
        searchParams,
    ] = useSearchParams();


    const {
        verifyEmail,
        resendVerificationCode,
    } = useAuth();


    const [
        email,
        setEmail,
    ] = useState(
        searchParams.get(
            "email"
        ) || ""
    );


    const [
        code,
        setCode,
    ] = useState("");


    const [
        error,
        setError,
    ] = useState("");


    const [
        success,
        setSuccess,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        resendLoading,
        setResendLoading,
    ] = useState(false);


    const [
        countdown,
        setCountdown,
    ] = useState(0);


    // =========================================
    // COUNTDOWN
    // =========================================

    useEffect(() => {

        if (
            countdown <= 0
        ) {

            return;

        }


        const timer =
            setInterval(() => {

                setCountdown(
                    (previous) =>
                        previous - 1
                );

            }, 1000);


        return () => {

            clearInterval(
                timer
            );

        };

    }, [countdown]);


    // =========================================
    // VERIFY
    // =========================================

    const handleVerify = async (
        e
    ) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        if (
            !email.trim()
        ) {

            setError(
                "Please enter your email."
            );

            return;

        }


        if (
            code.length !== 6
        ) {

            setError(
                "Please enter the 6-digit verification code."
            );

            return;

        }


        try {

            setLoading(true);


            await verifyEmail(
                email,
                code
            );


            setSuccess(
                "Email verified successfully! Redirecting..."
            );


            setTimeout(() => {

                navigate(
                    "/dashboard"
                );

            }, 1000);


        } catch (error) {

            setError(

                error.response
                    ?.data
                    ?.message ||

                "Invalid verification code."

            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // RESEND
    // =========================================

    const handleResend = async () => {

        setError("");

        setSuccess("");


        if (
            !email.trim()
        ) {

            setError(
                "Please enter your email."
            );

            return;

        }


        try {

            setResendLoading(
                true
            );


            await resendVerificationCode(
                email
            );


            setSuccess(
                "A new verification code has been sent to your email."
            );


            setCountdown(
                60
            );


        } catch (error) {

            setError(

                error.response
                    ?.data
                    ?.message ||

                "Unable to resend verification code."

            );

        } finally {

            setResendLoading(
                false
            );

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* Logo */}

                <div className="auth-logo">

                    <LinkIcon size={28} />

                </div>


                {/* Icon */}

                <div
                    style={{
                        display:
                            "flex",

                        justifyContent:
                            "center",

                        marginBottom:
                            "15px",

                        color:
                            "#635bff",
                    }}
                >

                    <MailCheck
                        size={42}
                    />

                </div>


                <h1>
                    Verify your email
                </h1>


                <p className="auth-subtitle">

                    We've sent a 6-digit
                    verification code to
                    your email address.

                </p>


                {/* Error */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {/* Success */}

                {success && (

                    <div
                        style={{
                            padding:
                                "10px 12px",

                            marginBottom:
                                "15px",

                            borderRadius:
                                "8px",

                            background:
                                "#ecfdf5",

                            color:
                                "#047857",

                            fontSize:
                                "13px",
                        }}
                    >

                        {success}

                    </div>

                )}


                <form
                    onSubmit={
                        handleVerify
                    }
                >


                    {/* Email */}

                    <label>
                        Email
                    </label>


                    <div className="input-wrapper">

                        <MailCheck
                            size={18}
                        />

                        <input

                            type="email"

                            placeholder="you@example.com"

                            value={email}

                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }

                            required

                        />

                    </div>


                    {/* OTP */}

                    <label>
                        Verification Code
                    </label>


                    <div className="input-wrapper">

                        <ShieldCheck
                            size={18}
                        />

                        <input

                            type="text"

                            inputMode="numeric"

                            maxLength={6}

                            placeholder="Enter 6-digit code"

                            value={code}

                            onChange={(e) => {

                                const value =
                                    e.target.value
                                        .replace(
                                            /\D/g,
                                            ""
                                        )
                                        .slice(
                                            0,
                                            6
                                        );

                                setCode(
                                    value
                                );

                            }}

                            required

                        />

                    </div>


                    {/* Verify */}

                    <button

                        type="submit"

                        className="primary-btn"

                        disabled={
                            loading
                        }

                    >

                        <ShieldCheck
                            size={18}
                        />


                        {loading

                            ? "Verifying..."

                            : "Verify Email"}

                    </button>


                </form>


                {/* Resend */}

                <button

                    type="button"

                    onClick={
                        handleResend
                    }

                    disabled={
                        resendLoading ||
                        countdown > 0
                    }

                    style={{
                        width:
                            "100%",

                        marginTop:
                            "12px",

                        border:
                            "none",

                        background:
                            "transparent",

                        color:
                            countdown > 0
                                ? "#999"
                                : "#635bff",

                        cursor:
                            countdown > 0
                                ? "default"
                                : "pointer",

                        fontWeight:
                            "600",

                        fontSize:
                            "13px",
                    }}

                >

                    {resendLoading

                        ? "Sending..."

                        : countdown > 0

                        ? `Resend code in ${countdown}s`

                        : "Resend verification code"}

                </button>


                <p className="auth-footer">

                    Already verified?{" "}

                    <Link to="/login">

                        Login

                    </Link>

                </p>


            </div>

        </div>

    );

};


export default VerifyEmail;
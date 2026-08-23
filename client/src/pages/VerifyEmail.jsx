import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useSearchParams,
    Link,
} from "react-router-dom";

import {
    CheckCircle,
    AlertCircle,
    Loader2,
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


    const email =
        searchParams.get("email");

    const code =
        searchParams.get("code");


    const [
        verificationCode,
        setVerificationCode,
    ] = useState(
        code || ""
    );


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        resendLoading,
        setResendLoading,
    ] = useState(false);


    const [
        success,
        setSuccess,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        message,
        setMessage,
    ] = useState("");


    // =========================================
    // AUTOMATIC VERIFICATION
    // =========================================

    useEffect(() => {

        if (
            email &&
            code
        ) {

            handleVerification(
                email,
                code
            );

        }

    }, []);


    // =========================================
    // VERIFY EMAIL
    // =========================================

    const handleVerification =
        async (
            verifyEmailAddress,
            verifyCode
        ) => {

            try {

                setLoading(true);

                setError("");

                setMessage("");


                await verifyEmail(
                    verifyEmailAddress,
                    verifyCode
                );


                setSuccess(true);


                // Redirect after verification
                setTimeout(() => {

                    navigate(
                        "/dashboard"
                    );

                }, 2000);


            } catch (error) {

                console.error(
                    "Email verification failed:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Invalid or expired verification code."

                );

            } finally {

                setLoading(false);

            }

        };


    // =========================================
    // MANUAL VERIFY
    // =========================================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        if (!email) {

            setError(
                "Email address is missing."
            );

            return;

        }


        if (
            !verificationCode ||
            verificationCode.length !== 6
        ) {

            setError(
                "Please enter the 6-digit verification code."
            );

            return;

        }


        await handleVerification(
            email,
            verificationCode
        );

    };


    // =========================================
    // RESEND CODE
    // =========================================

    const handleResend = async () => {

        if (!email) {

            setError(
                "Email address is missing."
            );

            return;

        }


        try {

            setResendLoading(true);

            setError("");

            setMessage("");


            const response =
                await resendVerificationCode(
                    email
                );


            setMessage(

                response?.message ||

                "A new verification code has been sent to your email."

            );


        } catch (error) {

            console.error(
                "Resend verification failed:",
                error
            );


            setError(

                error.response
                    ?.data
                    ?.message ||

                "Unable to resend verification code."

            );

        } finally {

            setResendLoading(false);

        }

    };


    // =========================================
    // SUCCESS SCREEN
    // =========================================

    if (success) {

        return (

            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-logo">

                        <CheckCircle
                            size={28}
                        />

                    </div>


                    <h1>
                        Email Verified!
                    </h1>


                    <p className="auth-subtitle">

                        Your email has been
                        successfully verified.

                    </p>


                    <div className="success-message">

                        <CheckCircle
                            size={18}
                        />

                        Account verified
                        successfully.

                    </div>


                    <p
                        style={{
                            marginTop: "20px",
                            textAlign: "center",
                        }}
                    >

                        Redirecting to
                        dashboard...

                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // LOADING SCREEN
    // =========================================

    if (
        loading &&
        code
    ) {

        return (

            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-logo">

                        <Loader2
                            size={28}
                            className="spin"
                        />

                    </div>


                    <h1>
                        Verifying Email...
                    </h1>


                    <p className="auth-subtitle">

                        Please wait while we
                        verify your email address.

                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // NORMAL VERIFICATION PAGE
    // =========================================

    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* Logo */}

                <div className="auth-logo">

                    <LinkIcon
                        size={28}
                    />

                </div>


                <h1>
                    Verify your email
                </h1>


                <p className="auth-subtitle">

                    Enter the 6-digit verification
                    code sent to your email.

                </p>


                {/* Error */}

                {error && (

                    <div className="error-message">

                        <AlertCircle
                            size={18}
                        />

                        {error}

                    </div>

                )}


                {/* Success message */}

                {message && (

                    <div className="success-message">

                        <CheckCircle
                            size={18}
                        />

                        {message}

                    </div>

                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* Email */}

                    <label>
                        Email
                    </label>


                    <input

                        type="email"

                        value={
                            email || ""
                        }

                        disabled

                        className="auth-input"

                    />


                    {/* Verification code */}

                    <label
                        style={{
                            marginTop: "16px",
                        }}
                    >
                        Verification Code
                    </label>


                    <input

                        type="text"

                        value={
                            verificationCode
                        }

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

                            setVerificationCode(
                                value
                            );

                        }}

                        placeholder="Enter 6-digit code"

                        maxLength={6}

                        inputMode="numeric"

                        required

                        className="auth-input"

                    />


                    {/* Verify */}

                    <button

                        type="submit"

                        className="primary-btn"

                        disabled={
                            loading
                        }

                    >

                        {loading ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="spin"
                                />

                                Verifying...

                            </>

                        ) : (

                            <>
                                <CheckCircle
                                    size={18}
                                />

                                Verify Email

                            </>

                        )}

                    </button>


                </form>


                {/* Resend */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                    }}
                >

                    <p>
                        Didn't receive the code?
                    </p>


                    <button

                        type="button"

                        onClick={
                            handleResend
                        }

                        disabled={
                            resendLoading
                        }

                        className="link-btn"

                    >

                        {resendLoading

                            ? "Sending..."

                            : "Resend Verification Code"}

                    </button>

                </div>


                {/* Login */}

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
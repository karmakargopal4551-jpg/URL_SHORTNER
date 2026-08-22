import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    UserPlus,
    Mail,
    Lock,
    User,
    Link as LinkIcon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


const Register = () => {

    const navigate =
        useNavigate();


    const {
        register,
    } = useAuth();


    const [
        formData,
        setFormData,
    ] = useState({

        name: "",
        email: "",
        password: "",

    });


    const [
        error,
        setError,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(false);


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value,

        });

    };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        setError("");


        if (
            formData.password.length <
            6
        ) {

            setError(
                "Password must be at least 6 characters"
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await register(
                    formData.name,
                    formData.email,
                    formData.password
                );


            // Email verification required

            if (
                response.requiresVerification
            ) {

                navigate(
                    `/verify-email?email=${encodeURIComponent(
                        formData.email
                    )}`
                );

                return;

            }


        } catch (error) {

            setError(

                error.response
                    ?.data
                    ?.message ||

                "Registration failed"

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* Logo */}

                <div className="auth-logo">

                    <LinkIcon size={28} />

                </div>


                <h1>
                    Create your account
                </h1>


                <p className="auth-subtitle">

                    Start creating and
                    managing short links.

                </p>


                {/* Error */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* Name */}

                    <label>
                        Name
                    </label>


                    <div className="input-wrapper">

                        <User size={18} />

                        <input

                            type="text"

                            name="name"

                            placeholder="Your name"

                            value={
                                formData.name
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* Email */}

                    <label>
                        Email
                    </label>


                    <div className="input-wrapper">

                        <Mail size={18} />

                        <input

                            type="email"

                            name="email"

                            placeholder="you@example.com"

                            value={
                                formData.email
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* Password */}

                    <label>
                        Password
                    </label>


                    <div className="input-wrapper">

                        <Lock size={18} />

                        <input

                            type="password"

                            name="password"

                            placeholder="Minimum 6 characters"

                            value={
                                formData.password
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* Submit */}

                    <button

                        type="submit"

                        className="primary-btn"

                        disabled={
                            loading
                        }

                    >

                        <UserPlus
                            size={18}
                        />


                        {loading

                            ? "Creating..."

                            : "Create Account"}

                    </button>


                </form>


                <p className="auth-footer">

                    Already have an
                    account?{" "}


                    <Link to="/login">

                        Login

                    </Link>

                </p>


            </div>

        </div>

    );

};


export default Register;
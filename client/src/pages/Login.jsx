import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    LogIn,
    Mail,
    Lock,
    Link as LinkIcon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            await login(email, password);

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <LinkIcon size={28} />
                </div>

                <h1>Welcome back</h1>

                <p className="auth-subtitle">
                    Login to manage your short links.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Email</label>

                    <div className="input-wrapper">
                        <Mail size={18} />

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <label>Password</label>

                    <div className="input-wrapper">
                        <Lock size={18} />

                        <input
                            type="password"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        <LogIn size={18} />

                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
import {
    ArrowRight,
    BarChart3,
    Clock,
    Link as LinkIcon,
    ShieldCheck,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleStart = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            navigate("/register");
        }
    };

    return (
        <div className="app">
            <Navbar />

            <main className="home">
                <section className="hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <LinkIcon size={15} />
                            Simple. Fast. Trackable.
                        </div>

                        <h1>
                            Short links.
                            <br />
                            <span>
                                Bigger possibilities.
                            </span>
                        </h1>

                        <p>
                            Create short, memorable URLs
                            with custom aliases,
                            expiration controls and
                            powerful analytics.
                        </p>

                        <div className="hero-actions">
                            <button
                                className="primary-btn hero-btn"
                                onClick={handleStart}
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </button>

                            {!user && (
                                <Link
                                    to="/login"
                                    className="secondary-btn"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                <section className="features">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <LinkIcon size={24} />
                        </div>

                        <h3>
                            Custom Aliases
                        </h3>

                        <p>
                            Create memorable short
                            links using your own
                            custom path.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <BarChart3 size={24} />
                        </div>

                        <h3>
                            Detailed Analytics
                        </h3>

                        <p>
                            Track clicks and
                            understand how your links
                            are being used.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Clock size={24} />
                        </div>

                        <h3>
                            Link Expiration
                        </h3>

                        <p>
                            Set expiration periods
                            for temporary links.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <ShieldCheck size={24} />
                        </div>

                        <h3>
                            Secure Accounts
                        </h3>

                        <p>
                            Your links are protected
                            with JWT authentication.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
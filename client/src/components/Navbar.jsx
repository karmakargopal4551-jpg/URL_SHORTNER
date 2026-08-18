import { Link, useNavigate } from "react-router-dom";
import {
    Link as LinkIcon,
    LogOut,
    LayoutDashboard,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="brand">
                <LinkIcon size={24} />
                <span>Shortly</span>
            </Link>

            <div className="nav-right">
                {user ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="nav-link"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>

                        <div className="user-info">
                            <div className="avatar">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <span>{user.name}</span>
                        </div>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="nav-link"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="nav-register"
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
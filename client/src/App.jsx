import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import { AuthProvider } from "./context/AuthContext";

// ==============================
// PAGES
// ==============================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AnalyticsOverview from "./pages/AnalyticsOverview";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";

// ==============================
// COMPONENTS
// ==============================

import ProtectedRoute from "./components/ProtectedRoute";

import DonationModal from "./components/DonationModal";
import UpgradeModal from "./components/UpgradeModal";
import QRModal from "./components/QRModal";


// =====================================================
// APP
// =====================================================

const App = () => {

    // =========================================
    // UPGRADE MODAL
    // =========================================

    const [
        upgradeOpen,
        setUpgradeOpen,
    ] = useState(false);


    // =========================================
    // QR MODAL
    // =========================================

    const [
        qrOpen,
        setQrOpen,
    ] = useState(false);


    // =========================================
    // GLOBAL EVENTS
    // =========================================

    useEffect(() => {

        // ---------------------------------
        // OPEN UPGRADE MODAL
        // ---------------------------------

        const handleOpenUpgrade = () => {

            setUpgradeOpen(true);

        };


        // ---------------------------------
        // OPEN QR MODAL
        // ---------------------------------

        const handleOpenQR = () => {

            setQrOpen(true);

        };


        // ---------------------------------
        // ADD EVENT LISTENERS
        // ---------------------------------

        window.addEventListener(
            "open-upgrade",
            handleOpenUpgrade
        );

        window.addEventListener(
            "open-qr",
            handleOpenQR
        );


        // ---------------------------------
        // CLEANUP
        // ---------------------------------

        return () => {

            window.removeEventListener(
                "open-upgrade",
                handleOpenUpgrade
            );

            window.removeEventListener(
                "open-qr",
                handleOpenQR
            );

        };

    }, []);


    return (

        <BrowserRouter>

            <AuthProvider>

                {/* =================================
                    GLOBAL DONATION MODAL
                ================================= */}

                <DonationModal />


                {/* =================================
                    GLOBAL UPGRADE MODAL
                ================================= */}

                {upgradeOpen && (

                    <UpgradeModal

                        onClose={() =>
                            setUpgradeOpen(false)
                        }

                        onSuccess={() => {
                            setUpgradeOpen(false);
                        }}

                    />

                )}


                {/* =================================
                    GLOBAL QR MODAL
                ================================= */}

                {qrOpen && (

                    <QRModal

                        onClose={() =>
                            setQrOpen(false)
                        }

                    />

                )}


                {/* =================================
                    ROUTES
                ================================= */}

                <Routes>


                    {/* ==============================
                        PUBLIC ROUTES
                    ============================== */}

                    <Route
                        path="/"
                        element={
                            <Home />
                        }
                    />


                    {/* LOGIN */}

                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />


                    {/* REGISTER */}

                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />


                    {/* EMAIL VERIFICATION */}

                    <Route
                        path="/verify-email"
                        element={
                            <VerifyEmail />
                        }
                    />


                    {/* ==============================
                        PROTECTED ROUTES
                    ============================== */}


                    {/* DASHBOARD */}

                    <Route
                        path="/dashboard"
                        element={

                            <ProtectedRoute>

                                <Dashboard />

                            </ProtectedRoute>

                        }
                    />


                    {/* ANALYTICS OVERVIEW */}

                    <Route
                        path="/analytics"
                        element={

                            <ProtectedRoute>

                                <AnalyticsOverview />

                            </ProtectedRoute>

                        }
                    />


                    {/* INDIVIDUAL ANALYTICS */}

                    <Route
                        path="/analytics/:id"
                        element={

                            <ProtectedRoute>

                                <Analytics />

                            </ProtectedRoute>

                        }
                    />


                    {/* PROFILE */}

                    <Route
                        path="/profile"
                        element={

                            <ProtectedRoute>

                                <Profile />

                            </ProtectedRoute>

                        }
                    />


                    {/* SETTINGS */}

                    <Route
                        path="/settings"
                        element={

                            <ProtectedRoute>

                                <Settings />

                            </ProtectedRoute>

                        }
                    />


                    {/* SUPPORT */}

                    <Route
                        path="/support"
                        element={

                            <ProtectedRoute>

                                <Support />

                            </ProtectedRoute>

                        }
                    />


                    {/* ==============================
                        FALLBACK
                    ============================== */}

                    <Route
                        path="*"
                        element={

                            <Navigate
                                to="/dashboard"
                                replace
                            />

                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );

};

export default App;
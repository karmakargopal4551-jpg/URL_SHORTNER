import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const AuthContext =
    createContext();


export const AuthProvider = ({
    children,
}) => {

    const [
        user,
        setUser,
    ] = useState(null);


    const [
        token,
        setToken,
    ] = useState(
        localStorage.getItem(
            "token"
        )
    );


    const [
        loading,
        setLoading,
    ] = useState(true);


    // =========================================
    // LOAD STORED USER
    // =========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "user"
            );


        if (storedUser) {

            try {

                setUser(
                    JSON.parse(
                        storedUser
                    )
                );

            } catch {

                localStorage.removeItem(
                    "user"
                );

            }

        }


        setLoading(false);

    }, []);


    // =========================================
    // REGISTER
    // =========================================

    const register = async (
        name,
        email,
        password
    ) => {

        const response =
            await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password,
                }
            );


        return response.data;

    };


    // =========================================
    // LOGIN
    // =========================================

    const login = async (
        email,
        password
    ) => {

        const response =
            await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );


        const {
            token,
            user,
        } = response.data;


        localStorage.setItem(
            "token",
            token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        setToken(token);

        setUser(user);


        return response.data;

    };


    // =========================================
    // VERIFY EMAIL
    // =========================================

    const verifyEmail = async (
        email,
        verificationCode
    ) => {

        const response =
            await api.post(
                "/auth/verify-email",
                {
                    email,
                    verificationCode,
                }
            );


        const {
            token,
            user,
        } = response.data;


        localStorage.setItem(
            "token",
            token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        setToken(token);

        setUser(user);


        return response.data;

    };


    // =========================================
    // RESEND OTP
    // =========================================

    const resendVerificationCode =
        async (
            email
        ) => {

            const response =
                await api.post(
                    "/auth/resend-verification",
                    {
                        email,
                    }
                );


            return response.data;

        };


    // =========================================
    // UPDATE USER
    // =========================================

    const updateUser = (
        updatedUser
    ) => {

        localStorage.setItem(
            "user",
            JSON.stringify(
                updatedUser
            )
        );


        setUser(
            updatedUser
        );

    };


    // =========================================
    // LOGOUT
    // =========================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        setToken(null);

        setUser(null);

    };


    return (

        <AuthContext.Provider
            value={{

                user,

                token,

                loading,

                register,

                login,

                verifyEmail,

                resendVerificationCode,

                updateUser,

                logout,

            }}
        >

            {children}

        </AuthContext.Provider>

    );

};


export const useAuth = () => {

    return useContext(
        AuthContext
    );

};
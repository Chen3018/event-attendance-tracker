import React, {createContext, useContext, useState, useEffect } from "react";

import type { AuthContextType, UserProfile } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        const storedProfile = localStorage.getItem("user_profile");
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }
    }, []);

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem("access_token", newToken);
    };

    const logout = () => {
        setToken(null);
        setProfile(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_profile");
    };

    const updateProfile = (userProfile: UserProfile) => {
        setProfile(userProfile);
        localStorage.setItem("user_profile", JSON.stringify(userProfile));
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, updateProfile, isAuthenticated: !!token, profile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
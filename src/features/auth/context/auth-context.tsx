"use client";

import {createContext, useCallback, useContext, useEffect, useState} from "react";
import type {AuthSession, User} from "@/features/auth/types/auth.type";
import {authApi} from "@/features/auth/services/auth.api";

const SESSION_KEY = "taskflow_session";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (session: AuthSession) => void;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // قراءة الجلسة من localStorage عند أول تحميل
    useEffect(() => {
        try {
            const stored = localStorage.getItem(SESSION_KEY);
            if (stored) {
                const session = JSON.parse(stored) as AuthSession;
                setUser(session.user);
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback((session: AuthSession) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session.user);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            localStorage.removeItem(SESSION_KEY);
            setUser(null);
        }
    }, []);

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
            const session = JSON.parse(stored) as AuthSession;
            localStorage.setItem(SESSION_KEY, JSON.stringify({...session, user: updatedUser}));
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
    return ctx;
}

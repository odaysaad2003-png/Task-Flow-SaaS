"use client";

import {createContext, useCallback, useContext, useEffect, useState} from "react";

const SIDEBAR_KEY = "taskflow_sidebar_collapsed";

interface SidebarContextValue {
    isCollapsed: boolean;
    toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({children}: {children: React.ReactNode}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // استعادة الحالة من localStorage
    useEffect(() => {
        const stored = localStorage.getItem(SIDEBAR_KEY);
        if (stored === "true") setIsCollapsed(true);
    }, []);

    const toggle = useCallback(() => {
        setIsCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem(SIDEBAR_KEY, String(next));
            return next;
        });
    }, []);

    return <SidebarContext.Provider value={{isCollapsed, toggle}}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
    return ctx;
}

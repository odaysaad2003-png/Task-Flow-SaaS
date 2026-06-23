"use client";

import {QueryProvider} from "@/components/providers/query-provider";
import {AuthProvider} from "@/features/auth/context/auth-context";
import {Toaster} from "@/components/ui/sonner";

export function AppProviders({children}: {children: React.ReactNode}) {
    return (
        <QueryProvider>
            <AuthProvider>
                {children}
                <Toaster position="top-center" richColors />
            </AuthProvider>
        </QueryProvider>
    );
}

"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Sidebar} from "@/components/layout/Sidebar";
import {Topbar} from "@/components/layout/Topbar";
import {SidebarProvider} from "@/components/layout/sidebar-context";
import {useAuth} from "@/features/auth/hooks/use-auth";
import {Skeleton} from "@/components/ui/skeleton";



// ─── Protected Layout ─────────────────────────────────────────────────────────
export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const {isLoading, isAuthenticated} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) return <DashboardSkeleton />;
    if (!isAuthenticated) return null;

    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden bg-muted/30">
                {/* ─── Sidebar — Desktop ─────────────── */}
                <div className="hidden lg:flex">
                    <Sidebar />
                </div>

                {/* ─── المحتوى الرئيسي ───────────────── */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-auto">
                        <div className="container mx-auto p-6">{children}</div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}


// ─── Loading fallback أثناء تحميل بيانات الجلسة ────────────────────────────
function DashboardSkeleton() {
    return (
        <div className="flex h-screen">
            <div className="w-64 border-l">
                <div className="h-14 border-b px-4 flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-24" />
                </div>
                <div className="p-3 space-y-1">
                    {Array.from({length: 7}).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full rounded-lg" />
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="h-14 border-b px-6 flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>
                <div className="flex-1 p-6">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({length: 4}).map((_, i) => (
                            <Skeleton key={i} className="h-28 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
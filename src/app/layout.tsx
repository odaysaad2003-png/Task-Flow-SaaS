import type {Metadata} from "next";

import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";

import "./globals.css";

import {AppProviders} from "@/components/providers/app-providers";

export const metadata: Metadata = {
    title: {
        default: "TaskFlow — إدارة المشاريع والفرق",
        template: "%s | TaskFlow",
    },
    description: "نظام SaaS متكامل لإدارة المشاريع والمهام والفرق.",
    applicationName: "TaskFlow",
};

type RootLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body className="min-h-screen bg-background font-sans text-foreground antialiased">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}

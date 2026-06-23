import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {AppProviders} from "@/components/providers/app-providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "TaskFlow — إدارة المشاريع والفرق",
    description: "نظام SaaS متكامل لإدارة المشاريع والمهام والفرق",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body className={inter.className}>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}

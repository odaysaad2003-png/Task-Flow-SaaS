"use client";

import {motion} from "framer-motion";
import {Sparkles} from "lucide-react";
import {useAuth} from "@/features/auth/hooks/use-auth";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 17) return "مساء الخير";
    return "مساء النور";
}

export function WelcomeBanner() {
    const {user} = useAuth();
    const firstName = user?.name.split(" ")[0] ?? "";

    return (
        <motion.div
            initial={{opacity: 0, y: -12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, ease: "easeOut"}}
            className="flex items-center justify-between"
        >
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <motion.div animate={{rotate: [0, 15, -10, 15, 0]}} transition={{delay: 0.6, duration: 0.6}}>
                        <Sparkles className="h-4 w-4 text-violet-500" />
                    </motion.div>
                    <span className="text-sm font-medium text-muted-foreground">{getGreeting()}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {firstName}
                    <span className="text-muted-foreground font-normal"> — هذا ملخص يومك</span>
                </h1>
            </div>

            {/* تاريخ اليوم */}
            <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">
                    {new Date().toLocaleDateString("ar-SA", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Dashboard Overview</p>
            </div>
        </motion.div>
    );
}

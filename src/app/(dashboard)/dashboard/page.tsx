"use client";

import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import {RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {WelcomeBanner} from "@/features/dashboard/components/WelcomeBanner";
import {StatsGrid} from "@/features/dashboard/components/StatsGrid";
import {TaskStatusChart} from "@/features/dashboard/components/TaskStatusChart";
import {RecentProjects} from "@/features/dashboard/components/RecentProjects";
import {RecentTasks} from "@/features/dashboard/components/RecentTasks";
import {ActivityFeed} from "@/features/dashboard/components/ActivityFeed";
import {useDashboard} from "@/features/dashboard/hooks/use-dashboard";
import {ErrorState} from "@/components/shared/ErrorState";
import {usePermissions} from "@/features/auth/hooks/use-permissions";

export default function DashboardPage() {
    const {stats, recent, isLoading, isError, refetch} = useDashboard();
    const {can} = usePermissions();

    if (isError) {
        return (
            <ErrorState
                title="تعذّر تحميل الداشبورد"
                message="حدث خطأ أثناء جلب البيانات. تحقق من اتصالك وحاول مرة أخرى."
                onRetry={refetch}
            />
        );
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            className="space-y-6 max-w-7xl mx-auto"
        >
            {/* ─── Banner + Refresh ──────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
                <WelcomeBanner />
                <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-2 text-xs mt-1"
                    onClick={refetch}
                    disabled={isLoading}
                >
                    <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                    تحديث
                </Button>
            </div>

            {/* ─── Stats Grid ───────────────────────────────────── */}
            <StatsGrid stats={stats} isLoading={isLoading} />

            {/* ─── Row 2: Recent Projects + Task Chart ─────────── */}
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <RecentProjects projects={recent?.recentProjects} isLoading={isLoading} />
                <TaskStatusChart stats={stats} isLoading={isLoading} />
            </div>

            {/* ─── Row 3: Tasks + Activity (مشروط بالدور) ─────── */}
            <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
                {/* مهامي للمستخدم العادي / آخر المهام للـ Admin */}
                <RecentTasks
                    tasks={can("team:manage") ? recent?.recentTasks : recent?.myTasks}
                    isLoading={isLoading}
                    title={can("team:manage") ? "آخر المهام" : "مهامي"}
                    emptyMessage={can("team:manage") ? "لم يتم إنشاء أي مهام بعد" : "لا توجد مهام مسندة إليك حالياً"}
                />

                {/* Activity Feed — مرئي للـ admin والـ member فقط */}
                {can("settings:edit") ? (
                    <ActivityFeed activities={recent?.activityFeed} isLoading={isLoading} />
                ) : (
                    // الـ viewer يرى إحصائيات المهام فقط
                    <TaskStatusChart stats={stats} isLoading={isLoading} />
                )}
            </div>
        </motion.div>
    );
}

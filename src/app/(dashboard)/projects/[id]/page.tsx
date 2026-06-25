"use client";

import {useCallback, useTransition} from "react";
import {useRouter, useSearchParams, usePathname} from "next/navigation";
import {motion} from "framer-motion";
import {LayoutDashboard, CheckSquare, MessageSquare, Activity} from "lucide-react";
import {ProjectDetailHeader} from "@/features/projects/components/ProjectDetailHeader";
import {ProjectOverviewTab} from "@/features/projects/components/tabs/ProjectOverviewTab";
import {ProjectTasksTab} from "@/features/projects/components/tabs/ProjectTasksTab";
import {ProjectCommentsTab} from "@/features/projects/components/tabs/ProjectCommentsTab";
import {ProjectActivityTab} from "@/features/projects/components/tabs/ProjectActivityTab";
import {DetailPageSkeleton} from "@/components/shared/PageSkeleton";
import {ErrorState} from "@/components/shared/ErrorState";
import {useProject} from "@/features/projects/hooks/use-projects";
import {cn} from "@/lib/utils";


import { use } from 'react'; // 1. استيراد دالة use

// ─── Tab Config ───────────────────────────────────────────────────────────────
type TabKey = "overview" | "tasks" | "comments" | "activity";

const TABS: {key: TabKey; label: string; icon: React.ElementType}[] = [
    {key: "overview", label: "نظرة عامة", icon: LayoutDashboard},
    {key: "tasks", label: "المهام", icon: CheckSquare},
    {key: "comments", label: "التعليقات", icon: MessageSquare},
    {key: "activity", label: "النشاط", icon: Activity},
];

// ─── Tab Hook ─────────────────────────────────────────────────────────────────
function useActiveTab() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const activeTab = (searchParams.get("tab") as TabKey) ?? "overview";

    const setTab = useCallback(
        (tab: TabKey) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", tab);
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`, {scroll: false});
            });
        },
        [searchParams, pathname, router]
    );

    return {activeTab, setTab, isPending};
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage({params}: {params: Promise<{id: string}>}) {
    // 3. فك تغليف الـ params باستخدام use() للحصول على الـ id
    const resolvedParams = use(params);

    // الآن يمكنك استخدام resolvedParams.id بشكل آمن
    const {data: project, isLoading, isError, refetch} = useProject(resolvedParams.id);
    const {activeTab, setTab} = useActiveTab();

    if (isLoading) return <DetailPageSkeleton />;

    if (isError || !project) {
        return (
            <ErrorState
                title="تعذّر تحميل المشروع"
                message="المشروع غير موجود أو حدث خطأ أثناء التحميل"
                onRetry={refetch}
            />
        );
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            className="space-y-6 max-w-5xl mx-auto"
        >
            {/* ─── Header ─────────────────────────────── */}
            <ProjectDetailHeader project={project} />

            {/* ─── Tabs Navigation ────────────────────── */}
            <div className="border-b">
                <nav className="flex gap-1" aria-label="Project tabs">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setTab(tab.key)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium",
                                    "border-b-2 -mb-px transition-colors duration-200",
                                    isActive
                                        ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* ─── Tab Content — Lazy per Tab ─────────── */}
            <div className="min-h-[400px]">
                {activeTab === "overview" && <ProjectOverviewTab project={project} />}
                {activeTab === "tasks" && <ProjectTasksTab projectId={project.id} />}
                {activeTab === "comments" && <ProjectCommentsTab projectId={project.id} />}
                {activeTab === "activity" && <ProjectActivityTab projectId={project.id} />}
            </div>
        </motion.div>
    );
}

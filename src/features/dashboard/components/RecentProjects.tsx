"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PopulatedProject } from "@/features/projects/types/project.type";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/auth/hooks/use-permissions";

interface RecentProjectsProps {
  projects?: PopulatedProject[];
  isLoading: boolean;
}
const statusConfig = {
  active: { label: "نشط", variant: "default" },
  planning: { label: "تخطيط", variant: "secondary" },
  "on-hold": { label: "متوقف", variant: "outline" },
  completed: { label: "مكتمل", variant: "secondary" },
};

const priorityDotColor: Record<string, string> = {
  low: "bg-slate-400",
  medium: "bg-amber-400",
  high: "bg-rose-500",
};

function ProjectRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
      <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  );
}

export function RecentProjects({ projects, isLoading }: RecentProjectsProps) {
  const { can } = usePermissions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="text-sm font-semibold">أحدث المشاريع</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            آخر المشاريع المضافة
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/projects">
            عرض الكل
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* List */}
      <div className="p-3 space-y-0.5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <ProjectRowSkeleton key={i} />
          ))
        ) : !projects?.length ? (
          <EmptyState
            icon={FolderKanban}
            title="لا توجد مشاريع بعد"
            message={
              can("project:create")
                ? "ابدأ بإنشاء مشروعك الأول"
                : "لا توجد مشاريع متاحة لك حالياً"
            }
            className="py-10"
          />
        ) : (
          projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl group",
                  "hover:bg-muted/70 transition-colors duration-200"
                )}
              >
                {/* أيقونة المشروع */}
                <div className="relative h-9 w-9 shrink-0 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                  <FolderKanban className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  {/* نقطة الأولوية */}
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                      priorityDotColor[project.priority]
                    )}
                  />
                </div>

                {/* المعلومات */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {project.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar className="h-3.5 w-3.5">
                      <AvatarImage src={project.owner.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-[8px]">
                        {project.owner.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {project.client.company}
                    </span>
                  </div>
                </div>

                {/* الحالة */}
                <Badge
                
                  className="shrink-0 text-[10px] h-5"
                >
                  {statusConfig[project.status]?.label ?? project.status}
                </Badge>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
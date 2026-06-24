"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PopulatedTask } from "@/features/tasks/types/task.type";
import { cn } from "@/lib/utils";

interface RecentTasksProps {
  tasks?: PopulatedTask[];
  isLoading: boolean;
  title?: string;
  emptyMessage?: string;
}

const statusIconMap: Record<string, React.ReactNode> = {
  todo: <Circle className="h-4 w-4 text-slate-400" />,
  "in-progress": <Clock className="h-4 w-4 text-blue-500" />,
  review: <AlertCircle className="h-4 w-4 text-amber-500" />,
  done: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

const priorityConfig = {
  low: { label: "منخفضة", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  medium: { label: "متوسطة", className: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
  high: { label: "عالية", className: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
  urgent: { label: "عاجلة", className: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400" },
};

function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <Skeleton className="h-4 w-4 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full shrink-0" />
    </div>
  );
}

export function RecentTasks({
  tasks,
  isLoading,
  title = "آخر المهام",
  emptyMessage = "لا توجد مهام حالياً",
}: RecentTasksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {tasks?.length ?? 0} مهمة
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/tasks">
            عرض الكل
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* List */}
      <div className="divide-y divide-border/50">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <TaskRowSkeleton key={i} />)
        ) : !tasks?.length ? (
          <EmptyState
            icon={CheckCircle2}
            title="لا توجد مهام"
            message={emptyMessage}
            className="py-10"
          />
        ) : (
          tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                "hover:bg-muted/50 transition-colors duration-150",
                task.status === "done" && "opacity-60"
              )}
            >
              {/* أيقونة الحالة */}
              <span className="shrink-0">{statusIconMap[task.status]}</span>

              {/* المعلومات */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    task.status === "done" && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {task.assignee && (
                    <div className="flex items-center gap-1">
                      <Avatar className="h-3.5 w-3.5">
                        <AvatarImage
                          src={task.assignee.avatarUrl ?? undefined}
                        />
                        <AvatarFallback className="text-[8px]">
                          {task.assignee.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] text-muted-foreground">
                        {task.assignee.name.split(" ")[0]}
                      </span>
                    </div>
                  )}
                  {task.dueDate && (
                    <span
                      className={cn(
                        "text-[11px]",
                        new Date(task.dueDate) < new Date() &&
                          task.status !== "done"
                          ? "text-rose-500 font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {new Date(task.dueDate).toLocaleDateString("ar-SA", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* الأولوية */}
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                  priorityConfig[task.priority]?.className
                )}
              >
                {priorityConfig[task.priority]?.label}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
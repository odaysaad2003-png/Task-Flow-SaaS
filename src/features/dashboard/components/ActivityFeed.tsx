"use client";

"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  UserCheck,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PopulatedActivityLog } from "@/features/activity/types/activity.type";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  activities?: PopulatedActivityLog[];
  isLoading: boolean;
}

const actionConfig = {
  created: {
    icon: <Plus className="h-3 w-3" />,
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    label: "أنشأ",
  },
  updated: {
    icon: <Pencil className="h-3 w-3" />,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    label: "عدّل",
  },
  deleted: {
    icon: <Trash2 className="h-3 w-3" />,
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400",
    label: "حذف",
  },
  status_changed: {
    icon: <RefreshCw className="h-3 w-3" />,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
    label: "غيّر حالة",
  },
  assigned: {
    icon: <UserCheck className="h-3 w-3" />,
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
    label: "أسند",
  },
  commented: {
    icon: <MessageSquare className="h-3 w-3" />,
    iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    label: "علّق على",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `منذ ${days} ${days === 1 ? "يوم" : "أيام"}`;
  if (hours > 0) return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
  if (mins > 0) return `منذ ${mins} ${mins === 1 ? "دقيقة" : "دقائق"}`;
  return "الآن";
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="text-sm font-semibold">سجل النشاط</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            آخر الأحداث في المشروع
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-muted-foreground">مباشر</span>
        </div>
      </div>

      {/* Feed */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : !activities?.length ? (
          <EmptyState
            icon={ArrowRight}
            title="لا يوجد نشاط بعد"
            message="ستظهر هنا الأحداث عند بدء العمل على المشاريع"
            className="py-8"
          />
        ) : (
          <div className="relative">
            {/* الخط الرأسي الرابط */}
            <div className="absolute right-[13px] top-4 bottom-4 w-px bg-border" />

            <div className="space-y-4">
              {activities.map((activity, i) => {
                const config =
                  actionConfig[activity.action] ?? actionConfig.updated;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.04 }}
                    className="flex gap-3 relative"
                  >
                    {/* أيقونة الحدث */}
                    <div
                      className={cn(
                        "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-card",
                        config.iconBg
                      )}
                    >
                      {config.icon}
                    </div>

                    {/* المحتوى */}
                    <div className="flex-1 pt-0.5 min-w-0">
                      <div className="flex items-start gap-1 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">
                          {activity.actor.name.split(" ")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {activity.message.replace(
                            activity.actor.name,
                            ""
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-3.5 w-3.5">
                          <AvatarImage
                            src={activity.actor.avatarUrl ?? undefined}
                          />
                          <AvatarFallback className="text-[8px]">
                            {activity.actor.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] text-muted-foreground">
                          {timeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
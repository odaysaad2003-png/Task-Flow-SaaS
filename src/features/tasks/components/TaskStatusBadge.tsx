import {cn} from "@/lib/utils";
import {TASK_STATUS_CONFIG} from "@/features/tasks/constants/task.constants";
import type {TaskStatus} from "@/features/tasks/types/task.type";

export function TaskStatusBadge({status, className}: {status: TaskStatus; className?: string}) {
    const config = TASK_STATUS_CONFIG[status];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                config.bg,
                config.color,
                className
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
            {config.label}
        </span>
    );
}

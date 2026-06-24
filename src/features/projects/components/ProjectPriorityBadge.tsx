import {cn} from "@/lib/utils";
import {PROJECT_PRIORITY_CONFIG} from "@/features/projects/constants/project.constants";
import type {ProjectPriority} from "@/features/projects/types/project.type";

interface ProjectPriorityBadgeProps {
    priority: ProjectPriority;
    className?: string;
}

export function ProjectPriorityBadge({priority, className}: ProjectPriorityBadgeProps) {
    const config = PROJECT_PRIORITY_CONFIG[priority];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
                config.bg,
                config.color,
                className
            )}
        >
            {config.label}
        </span>
    );
}

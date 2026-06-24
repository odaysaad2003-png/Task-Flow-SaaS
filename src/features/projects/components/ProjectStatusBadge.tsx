import {cn} from "@/lib/utils";
import {PROJECT_STATUS_CONFIG} from "@/features/projects/constants/project.constants";
import type {ProjectStatus} from "@/features/projects/types/project.type";

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
    className?: string;
}

export function ProjectStatusBadge({status, className}: ProjectStatusBadgeProps) {
    const config = PROJECT_STATUS_CONFIG[status];

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

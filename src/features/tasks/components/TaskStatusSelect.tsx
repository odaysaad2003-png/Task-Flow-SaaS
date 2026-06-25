"use client";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {TASK_STATUS_CONFIG} from "@/features/tasks/constants/task.constants";
import type {TaskStatus} from "@/features/tasks/types/task.type";
import {cn} from "@/lib/utils";

interface TaskStatusSelectProps {
    value: TaskStatus;
    onChange: (status: TaskStatus) => void;
    disabled?: boolean;
}

export function TaskStatusSelect({value, onChange, disabled}: TaskStatusSelectProps) {
    const config = TASK_STATUS_CONFIG[value];

    return (
        <Select value={value} onValueChange={(v) => onChange(v as TaskStatus)} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    "h-7 w-auto gap-1.5 rounded-full border px-2.5 text-xs font-medium",
                    "focus:ring-0 focus:ring-offset-0",
                    config.bg,
                    config.color,
                    config.border
                )}
            >
                <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {(Object.keys(TASK_STATUS_CONFIG) as TaskStatus[]).map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                        <div className="flex items-center gap-2">
                            <span className={cn("h-1.5 w-1.5 rounded-full", TASK_STATUS_CONFIG[s].dot)} />
                            {TASK_STATUS_CONFIG[s].label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

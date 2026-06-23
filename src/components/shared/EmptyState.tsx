import type {LucideIcon} from "lucide-react";
import {InboxIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    message?: string;
    className?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({icon: Icon = InboxIcon, title, message, action, className}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-1.5">{title}</h3>
            {message && <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{message}</p>}
            {action && (
                <Button size="sm" className="mt-5" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}

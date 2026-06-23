import {AlertCircle, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    title = "حدث خطأ",
    message = "فشل تحميل البيانات. يرجى المحاولة مرة أخرى.",
    onRetry,
    className,
}: ErrorStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-base font-semibold mb-1.5">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{message}</p>
            {onRetry && (
                <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
                    <RefreshCw className="ml-2 h-4 w-4" />
                    إعادة المحاولة
                </Button>
            )}
        </div>
    );
}

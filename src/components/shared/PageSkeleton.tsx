import {Skeleton} from "@/components/ui/skeleton";

// ─── لقوائم البيانات (Projects, Tasks...) ────────────────────────────────────
export function ListPageSkeleton({count = 6}: {count?: number}) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            {/* Filters */}
            <div className="flex gap-3">
                <Skeleton className="h-9 w-64 rounded-lg" />
                <Skeleton className="h-9 w-36 rounded-lg" />
                <Skeleton className="h-9 w-36 rounded-lg" />
            </div>
            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({length: count}).map((_, i) => (
                    <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// ─── لصفحة التفاصيل ──────────────────────────────────────────────────────────
export function DetailPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-20 rounded-lg" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {Array.from({length: 4}).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-96 rounded-xl" />
        </div>
    );
}

// ─── للداشبورد ────────────────────────────────────────────────────────────────
export function DashboardPageSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({length: 4}).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
            </div>
        </div>
    );
}

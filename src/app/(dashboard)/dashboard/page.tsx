import {DashboardPageSkeleton} from "@/components/shared/PageSkeleton";

export default function DashboardPage() {
    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-6">🚧 Sprint 3 سيبني هذه الصفحة — لوحة التحكم الرئيسية</p>
            <DashboardPageSkeleton />
        </div>
    );
}

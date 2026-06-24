"use client";

import {useCallback, useTransition} from "react";
import {useRouter, useSearchParams, usePathname} from "next/navigation";
import {Search, X, SlidersHorizontal} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useQuery} from "@tanstack/react-query";
import {clientApi} from "@/features/clients/services/client.api";
import {queryKeys} from "@/lib/query-keys";
import {STATUS_OPTIONS, PRIORITY_OPTIONS} from "@/features/projects/constants/project.constants";
import {cn} from "@/lib/utils";
import {useDebouncedCallback} from "use-debounce";

// هذا الـ hook المساعد الوحيد المسموح به هنا
function useProjectFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const setParam = useCallback(
        (key: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            // أعِد التوجيه لصفحة 1 عند تغيير أي فلتر
            params.delete("page");
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`, {scroll: false});
            });
        },
        [searchParams, pathname, router]
    );

    const clearAll = useCallback(() => {
        startTransition(() => {
            router.push(pathname, {scroll: false});
        });
    }, [pathname, router]);

    const hasActiveFilters =
        searchParams.has("status") ||
        searchParams.has("clientId") ||
        searchParams.has("priority") ||
        searchParams.has("search");

    return {
        searchParams,
        setParam,
        clearAll,
        hasActiveFilters,
        isPending,
    };
}

export function ProjectFilters() {
    const {searchParams, setParam, clearAll, hasActiveFilters, isPending} = useProjectFilters();

    // جلب العملاء لخيار الفلترة
    const {data: clients} = useQuery({
        queryKey: queryKeys.clients.list({}),
        queryFn: () => clientApi.getAll(),
        staleTime: 5 * 60 * 1000, // 5 دقائق — العملاء لا يتغيّرون كثيراً
    });

    // debounce للبحث النصي — 400ms لتجنب طلبات زائدة
    const handleSearch = useDebouncedCallback((value: string) => {
        setParam("search", value || null);
    }, 400);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {/* ─── Search Input ───────────────────────────── */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="البحث في المشاريع..."
                    className="pr-9"
                    defaultValue={searchParams.get("search") ?? ""}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {/* ─── Status Filter ──────────────────────── */}
                <Select value={searchParams.get("status") ?? "all"} onValueChange={(v) => setParam("status", v)}>
                    <SelectTrigger className="w-[140px] h-9">
                        <SlidersHorizontal className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                        <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* ─── Priority Filter ────────────────────── */}
                <Select value={searchParams.get("priority") ?? "all"} onValueChange={(v) => setParam("priority", v)}>
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                        {PRIORITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* ─── Client Filter ──────────────────────── */}
                <Select value={searchParams.get("clientId") ?? "all"} onValueChange={(v) => setParam("clientId", v)}>
                    <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="العميل" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">كل العملاء</SelectItem>
                        {clients?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.company}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* ─── Clear Button ───────────────────────── */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-9"
                        onClick={clearAll}
                    >
                        <X className="h-3.5 w-3.5" />
                        مسح الفلاتر
                    </Button>
                )}
            </div>

            {/* مؤشر تحميل الفلترة */}
            {isPending && <span className="text-xs text-muted-foreground animate-pulse">جارٍ الفلترة...</span>}
        </div>
    );
}

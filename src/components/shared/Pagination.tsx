"use client";

import {useCallback, useTransition} from "react";
import {useRouter, useSearchParams, usePathname} from "next/navigation";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import type {PaginationMeta} from "@/types/shared.type";

interface PaginationProps {
    meta: PaginationMeta;
}

export function Pagination({meta}: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const goToPage = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", String(page));
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`, {scroll: false});
            });
        },
        [searchParams, pathname, router]
    );

    if (meta.totalPages <= 1) return null;

    // بناء أرقام الصفحات الظاهرة (window of 5)
    const pages: number[] = [];
    const start = Math.max(1, meta.page - 2);
    const end = Math.min(meta.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-muted-foreground">
                {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} من {meta.total} مشروع
            </p>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(meta.page - 1)}
                    disabled={meta.page === 1 || isPending}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {start > 1 && (
                    <>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(1)}>
                            1
                        </Button>
                        {start > 2 && <span className="px-1 text-muted-foreground">...</span>}
                    </>
                )}

                {pages.map((p) => (
                    <Button
                        key={p}
                        variant={p === meta.page ? "default" : "outline"}
                        size="icon"
                        className={cn("h-8 w-8 text-xs", p === meta.page && "bg-violet-600 hover:bg-violet-700")}
                        onClick={() => goToPage(p)}
                        disabled={isPending}
                    >
                        {p}
                    </Button>
                ))}

                {end < meta.totalPages && (
                    <>
                        {end < meta.totalPages - 1 && <span className="px-1 text-muted-foreground">...</span>}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(meta.totalPages)}
                        >
                            {meta.totalPages}
                        </Button>
                    </>
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(meta.page + 1)}
                    disabled={meta.page === meta.totalPages || isPending}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

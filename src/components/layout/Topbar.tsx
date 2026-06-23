"use client";

import {usePathname} from "next/navigation";
import {Bell, Menu, Search, Settings, LogOut, ChevronDown, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Separator} from "@/components/ui/separator";
import {navItems} from "@/config/navigation";
import {useAuth} from "@/features/auth/hooks/use-auth";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

// ─── خريطة أسماء الصفحات ────────────────────────────────────────────────────
const pageTitleMap: Record<string, string> = {
    "/dashboard": "لوحة التحكم",
    "/projects": "المشاريع",
    "/tasks": "المهام",
    "/clients": "العملاء",
    "/team": "الفريق",
    "/activity": "سجل النشاط",
    "/settings": "الإعدادات",
};

function getPageTitle(pathname: string): string {
    // مطابقة دقيقة أولاً
    if (pageTitleMap[pathname]) return pageTitleMap[pathname];
    // مطابقة جزئية (للصفحات الديناميكية مثل /projects/[id])
    const match = Object.entries(pageTitleMap).find(([key]) => pathname.startsWith(key));
    return match ? match[1] : "TaskFlow";
}

function getInitials(name: string) {
    return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Mobile Sidebar Content ───────────────────────────────────────────────────
function MobileSidebarContent() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full pt-4">
            <nav className="flex flex-col gap-1 px-3">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-violet-50 text-violet-700"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
export function Topbar() {
    const pathname = usePathname();
    const {user, logout} = useAuth();
    const router = useRouter();
    const pageTitle = getPageTitle(pathname);

    async function handleLogout() {
        await logout();
        toast.success("تم تسجيل الخروج بنجاح");
        router.push("/login");
    }

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            {/* ─── Mobile: زر فتح Sidebar ──────────────────────── */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-0">
                    <div className="flex h-14 items-center border-b px-4">
                        <span className="font-bold">TaskFlow</span>
                    </div>
                    <MobileSidebarContent />
                </SheetContent>
            </Sheet>

            {/* ─── عنوان الصفحة ────────────────────────────────── */}
            <div className="flex-1">
                <h1 className="text-base font-semibold">{pageTitle}</h1>
            </div>

            {/* ─── أدوات اليمين ────────────────────────────────── */}
            <div className="flex items-center gap-1">
                {/* زر البحث */}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                </Button>

                {/* زر الإشعارات */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    <Bell className="h-4 w-4" />
                    {/* badge عدد الإشعارات غير المقروءة — سيتم ربطه بـ API في Sprint 9 */}
                    <span className="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full bg-violet-600" />
                </Button>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* قائمة المستخدم */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 items-center gap-2 px-2 hover:bg-muted">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={user?.avatarUrl ?? undefined} />
                                <AvatarFallback className="text-[10px]">
                                    {user ? getInitials(user.name) : "?"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm font-medium md:block">{user?.name}</span>
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                {user?.role && (
                                    <Badge variant="secondary" className="w-fit text-[10px]">
                                        {user.role === "admin"
                                            ? "مدير النظام"
                                            : user.role === "member"
                                            ? "عضو فريق"
                                            : "مشاهد"}
                                    </Badge>
                                )}
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="cursor-pointer">
                                <User className="ml-2 h-4 w-4" />
                                الملف الشخصي
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="cursor-pointer">
                                <Settings className="ml-2 h-4 w-4" />
                                الإعدادات
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="ml-2 h-4 w-4" />
                            تسجيل الخروج
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

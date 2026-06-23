"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight, Layers } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/config/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ─── Role Badge ───────────────────────────────────────────────────────────────
const roleLabelMap: Record<string, string> = {
  admin: "مدير",
  member: "عضو",
  viewer: "مشاهد",
};

const roleColorMap: Record<string, "default" | "secondary" | "outline"> = {
    admin: "default",
    manager: "secondary",
    member: "outline",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────
function NavItem({
  item,
  isCollapsed,
}: {
  item: (typeof navItems)[0];
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href));

  const content = (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        "transition-all duration-200 ease-in-out",
        isActive
          ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive
            ? "text-violet-600 dark:text-violet-400"
            : "group-hover:text-foreground"
        )}
      />
      {!isCollapsed && (
        <span className="truncate">{item.title}</span>
      )}
      {/* شريط جانبي للعنصر النشط */}
      {isActive && !isCollapsed && (
        <span className="mr-auto h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="left" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/login");
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "relative flex h-screen flex-col border-l bg-background",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* ─── الشعار ─────────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex h-14 items-center border-b px-4",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600">
              <Layers className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-base font-bold tracking-tight">
                TaskFlow
              </span>
            )}
          </Link>

          {/* زر التصغير/التكبير */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={toggle}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* ─── Navigation ─────────────────────────────────────────────── */}
        <ScrollArea className="flex-1">
          <nav
            className={cn(
              "flex flex-col gap-1 p-3",
              isCollapsed && "items-center"
            )}
          >
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </ScrollArea>

        <Separator />

        {/* ─── User Section ────────────────────────────────────────────── */}
        <div className={cn("p-3", isCollapsed && "flex justify-center")}>
          {isCollapsed ? (
            /* حالة التصغير: أيقونة المستخدم فقط */
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-1.5 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {user ? getInitials(user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            /* حالة التوسع: معلومات كاملة */
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xs">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium leading-none mb-1">
                  {user?.name}
                </p>
                <Badge
                  variant={roleColorMap[user?.role ?? "viewer"]}
                  className="h-4 px-1.5 text-[10px]"
                >
                  {roleLabelMap[user?.role ?? "viewer"]}
                </Badge>
              </div>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">تسجيل الخروج</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* زر التوسع عند التصغير */}
        {isCollapsed && (
          <div className="flex justify-center p-2 border-t">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggle}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
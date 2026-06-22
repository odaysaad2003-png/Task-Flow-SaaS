import type {LucideIcon} from "lucide-react";
import {LayoutDashboard, FolderKanban, ListChecks, Users, Building2, Activity, Settings} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export const navItems: NavItem[] = [
    {title: "Dashboard", href: "/dashboard", icon: LayoutDashboard},
    {title: "Projects", href: "/projects", icon: FolderKanban},
    {title: "Tasks", href: "/tasks", icon: ListChecks},
    {title: "Clients", href: "/clients", icon: Building2},
    {title: "Team", href: "/team", icon: Users},
    {title: "Activity", href: "/activity", icon: Activity},
    {title: "Settings", href: "/settings", icon: Settings},
];

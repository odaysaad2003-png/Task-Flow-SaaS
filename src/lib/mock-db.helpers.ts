import {db} from "./mock-db";
import type {ActivityLog} from "@/features/activity/types/activity.type";

// ─── ID Generator ───────────────────────────────────────────
export function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Delay Simulator (محاكاة تأخير الشبكة) ─────────────────
export function simulateDelay(ms = 400): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Populate Helpers ───────────────────────────────────────
export function getUserById(id: string) {
    return db.users.find((u) => u.id === id) ?? null;
}

export function getClientById(id: string) {
    return db.clients.find((c) => c.id === id) ?? null;
}

// ─── Activity Logger ────────────────────────────────────────
export function logActivity(entry: Omit<ActivityLog, "id" | "createdAt">): void {
    db.activityLogs.unshift({
        ...entry,
        id: generateId("a"),
        createdAt: new Date().toISOString(),
    });
}

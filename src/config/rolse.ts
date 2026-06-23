export const ROLES = ["admin", "member", "viewer"] as const;
export type Role = typeof ROLES[number];

export const PERMISSIONS = {
    "project:create": ["admin", "member"],
    "project:delete": ["admin"],
    "task:create": ["admin", "member"],
    "task:delete": ["admin", "member"],
    "client:create": ["admin", "member"],
    "client:delete": ["admin"],
    "team:manage": ["admin"],
    "settings:edit": ["admin", "member"],
} as const;

// ← مُضاف: type مستخرج من الـ PERMISSIONS
export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
    return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

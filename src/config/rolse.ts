export const ROLES = ["admin", "member", "viewer"] as const;
export type Role = typeof ROLES[number];

export const PERMISSIONS = {
    "project:create": ["admin", "member"],
    "project:delete": ["admin"],
    "task:create": ["admin", "member"],
    "task:delete": ["admin", "member"],
    "client:delete": ["admin"],
} as const;

export function can(role: Role, permission: keyof typeof PERMISSIONS): boolean {
    return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

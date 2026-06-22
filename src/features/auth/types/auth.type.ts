
import type {Role} from "@/config/rolse";

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    role: Role;
    createdAt: string;
}

export interface AuthSession {
    user: User;
    token: string;
}
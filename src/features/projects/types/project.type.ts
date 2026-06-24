import type { User } from "@/features/auth/types/auth.type";
import type { Client } from "@/features/clients/types/client.type";

export type ProjectStatus = "planning" | "active" | "on-hold" | "completed";
export type ProjectPriority = "low" | "medium" | "high"; 

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  clientId: string;
  ownerId: string;
  memberIds: string[];
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// شكل المشروع بعد Populate (للعرض في الـ UI)
export interface PopulatedProject extends Omit<Project, "clientId" | "ownerId"> {
  client: Client;
  owner: Pick<User, "id" | "name" | "avatarUrl">;
}

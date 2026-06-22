import type { User } from "@/features/auth/types/auth.type";

export type ActivityEntityType = "project" | "task" | "comment";
export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "assigned"
  | "commented";

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  message: string;
  entityType: ActivityEntityType;
  entityId: string;
  actorId: string;
  createdAt: string;
}

export interface PopulatedActivityLog extends Omit<ActivityLog, "actorId"> {
  actor: Pick<User, "id" | "name" | "avatarUrl">;
}

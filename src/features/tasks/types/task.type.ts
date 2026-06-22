import type { User } from "@/features/auth/types/auth.type";

export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedTask extends Omit<Task, "assigneeId"> {
  assignee: Pick<User, "id" | "name" | "avatarUrl"> | null;
}

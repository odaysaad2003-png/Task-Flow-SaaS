import type { User } from "@/features/auth/types/auth.type";

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  createdAt: string;
}

export interface PopulatedComment extends Omit<Comment, "authorId"> {
  author: Pick<User, "id" | "name" | "avatarUrl">;
}

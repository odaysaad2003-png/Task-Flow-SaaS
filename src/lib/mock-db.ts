import type {User} from "@/features/auth/types/auth.type";
import type {Client} from "@/features/clients/types/client.type";
import type {Project} from "@/features/projects/types/project.type";
import type {Task} from "@/features/tasks/types/task.type";
import type {Comment} from "@/features/comments/types/comment.type";
import type {ActivityLog} from "@/features/activity/types/activity.type";
import type {Notification} from "@/features/notifications/types/notification.type";

// ─── Seed Data ───────────────────────────────────────────────

const users: User[] = [
    {
        id: "u1",
        name: "Ahmed Al-Rashid",
        email: "admin@taskflow.dev",
        avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=ahmed",
        role: "admin",
        createdAt: "2024-01-01T08:00:00Z",
    },
    {
        id: "u2",
        name: "Sara Hassan",
        email: "sara@taskflow.dev",
        avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=sara",
        role: "member",
        createdAt: "2024-01-05T08:00:00Z",
    },
    {
        id: "u3",
        name: "Khalid Nour",
        email: "khalid@taskflow.dev",
        avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=khalid",
        role: "member",
        createdAt: "2024-01-10T08:00:00Z",
    },
    {
        id: "u4",
        name: "Lina Matar",
        email: "lina@taskflow.dev",
        avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=lina",
        role: "viewer",
        createdAt: "2024-02-01T08:00:00Z",
    },
];

const clients: Client[] = [
    {
        id: "c1",
        name: "Omar Khaled",
        company: "Innovate Co.",
        email: "omar@innovate.com",
        phone: "+966501234567",
        status: "active",
        createdAt: "2024-01-15T08:00:00Z",
    },
    {
        id: "c2",
        name: "Nadia Saleh",
        company: "BuildTech LLC",
        email: "nadia@buildtech.com",
        phone: null,
        status: "active",
        createdAt: "2024-02-01T08:00:00Z",
    },
    {
        id: "c3",
        name: "Faris Al-Amin",
        company: "DataFlow Systems",
        email: "faris@dataflow.io",
        phone: "+966509876543",
        status: "inactive",
        createdAt: "2024-02-15T08:00:00Z",
    },
];

const projects: Project[] = [
    {
        id: "p1",
        name: "E-Commerce Platform Redesign",
        description: "Complete overhaul of the frontend and UX for the client's main store.",
        status: "active",
        priority: "high",
        clientId: "c1",
        ownerId: "u1",
        memberIds: ["u2", "u3"],
        startDate: "2024-03-01T00:00:00Z",
        dueDate: "2024-06-30T00:00:00Z",
        createdAt: "2024-03-01T08:00:00Z",
        updatedAt: "2024-03-01T08:00:00Z",
    },
    {
        id: "p2",
        name: "Mobile App MVP",
        description: "React Native MVP for delivery tracking.",
        status: "planning",
        priority: "medium",
        clientId: "c2",
        ownerId: "u1",
        memberIds: ["u2"],
        startDate: "2024-04-01T00:00:00Z",
        dueDate: "2024-08-31T00:00:00Z",
        createdAt: "2024-04-01T08:00:00Z",
        updatedAt: "2024-04-01T08:00:00Z",
    },
    {
        id: "p3",
        name: "Analytics Dashboard",
        description: "Real-time analytics and reporting system for internal use.",
        status: "on-hold",
        priority: "low",
        clientId: "c3",
        ownerId: "u2",
        memberIds: ["u3", "u4"],
        startDate: "2024-02-01T00:00:00Z",
        dueDate: "2024-05-01T00:00:00Z",
        createdAt: "2024-02-01T08:00:00Z",
        updatedAt: "2024-02-15T08:00:00Z",
    },
    {
        id: "p4",
        name: "CRM Integration",
        description: "Integrate third-party CRM with the existing system.",
        status: "completed",
        priority: "high",
        clientId: "c1",
        ownerId: "u1",
        memberIds: ["u2", "u3"],
        startDate: "2024-01-01T00:00:00Z",
        dueDate: "2024-02-28T00:00:00Z",
        createdAt: "2024-01-01T08:00:00Z",
        updatedAt: "2024-03-01T08:00:00Z",
    },
];

const tasks: Task[] = [
    {
        id: "t1",
        title: "Design new homepage wireframes",
        description: "Create low and high fidelity wireframes for the homepage.",
        status: "done",
        priority: "high",
        projectId: "p1",
        assigneeId: "u2",
        dueDate: "2024-03-15T00:00:00Z",
        createdAt: "2024-03-02T08:00:00Z",
        updatedAt: "2024-03-14T08:00:00Z",
    },
    {
        id: "t2",
        title: "Implement product listing page",
        description: "Build the product grid with filters and sorting.",
        status: "in-progress",
        priority: "high",
        projectId: "p1",
        assigneeId: "u3",
        dueDate: "2024-04-01T00:00:00Z",
        createdAt: "2024-03-10T08:00:00Z",
        updatedAt: "2024-03-20T08:00:00Z",
    },
    {
        id: "t3",
        title: "Setup authentication flow",
        description: "Implement JWT auth with refresh token logic.",
        status: "todo",
        priority: "urgent",
        projectId: "p1",
        assigneeId: "u1",
        dueDate: "2024-04-10T00:00:00Z",
        createdAt: "2024-03-15T08:00:00Z",
        updatedAt: "2024-03-15T08:00:00Z",
    },
    {
        id: "t4",
        title: "Define app navigation structure",
        description: "Plan all screens and navigation flow for the MVP.",
        status: "todo",
        priority: "medium",
        projectId: "p2",
        assigneeId: "u2",
        dueDate: "2024-04-10T00:00:00Z",
        createdAt: "2024-04-02T08:00:00Z",
        updatedAt: "2024-04-02T08:00:00Z",
    },
    {
        id: "t5",
        title: "Integrate analytics data source",
        description: "Connect Grafana or similar tool to the data pipeline.",
        status: "review",
        priority: "medium",
        projectId: "p3",
        assigneeId: "u3",
        dueDate: "2024-03-20T00:00:00Z",
        createdAt: "2024-02-10T08:00:00Z",
        updatedAt: "2024-03-10T08:00:00Z",
    },
    {
        id: "t6",
        title: "Write API documentation",
        description: "Document all CRM integration endpoints in Swagger.",
        status: "done",
        priority: "low",
        projectId: "p4",
        assigneeId: "u1",
        dueDate: "2024-02-20T00:00:00Z",
        createdAt: "2024-02-01T08:00:00Z",
        updatedAt: "2024-02-19T08:00:00Z",
    },
];

const comments: Comment[] = [
    {
        id: "cm1",
        content: "The wireframes look great! Let's move to hi-fi.",
        taskId: "t1",
        authorId: "u1",
        createdAt: "2024-03-14T10:00:00Z",
    },
    {
        id: "cm2",
        content: "I'll need access to the design system assets first.",
        taskId: "t2",
        authorId: "u3",
        createdAt: "2024-03-21T09:00:00Z",
    },
    {
        id: "cm3",
        content: "Can we use Supabase Auth here instead of building from scratch?",
        taskId: "t3",
        authorId: "u2",
        createdAt: "2024-03-16T11:00:00Z",
    },
];

const activityLogs: ActivityLog[] = [
    {
        id: "a1",
        action: "created",
        message: "Ahmed created project 'E-Commerce Platform Redesign'",
        entityType: "project",
        entityId: "p1",
        actorId: "u1",
        createdAt: "2024-03-01T08:00:00Z",
    },
    {
        id: "a2",
        action: "status_changed",
        message: "Sara changed task 'Design new homepage wireframes' to done",
        entityType: "task",
        entityId: "t1",
        actorId: "u2",
        createdAt: "2024-03-14T08:00:00Z",
    },
    {
        id: "a3",
        action: "commented",
        message: "Ahmed commented on task 'Design new homepage wireframes'",
        entityType: "comment",
        entityId: "cm1",
        actorId: "u1",
        createdAt: "2024-03-14T10:00:00Z",
    },
    {
        id: "a4",
        action: "assigned",
        message: "Ahmed assigned 'Setup authentication flow' to Khalid",
        entityType: "task",
        entityId: "t3",
        actorId: "u1",
        createdAt: "2024-03-15T08:00:00Z",
    },
];

const notifications: Notification[] = [
    {
        id: "n1",
        title: "New task assigned",
        message: "You were assigned to 'Setup authentication flow'",
        isRead: false,
        userId: "u3",
        createdAt: "2024-03-15T08:00:00Z",
    },
    {
        id: "n2",
        title: "Comment on your task",
        message: "Ahmed commented on 'Design homepage wireframes'",
        isRead: true,
        userId: "u2",
        createdAt: "2024-03-14T10:00:00Z",
    },
];

// ─── DB Object (يُعدَّل في الذاكرة مباشرة — يحاكي DB CRUD) ───

export const db = {
    users,
    clients,
    projects,
    tasks,
    comments,
    activityLogs,
    notifications,
};

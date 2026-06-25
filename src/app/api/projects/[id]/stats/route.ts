import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {simulateDelay} from "@/lib/mock-db.helpers";

type RouteContext = {
    params: Promise<{id: string}>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
    const {id} = await context.params;
    await simulateDelay(200);

    const project = db.projects.find((p) => p.id === id);

    if (!project) {
        return NextResponse.json({data: null, error: {message: "المشروع غير موجود", code: "NOT_FOUND"}}, {status: 404});
    }

    const tasks = db.tasks.filter((t) => t.projectId === id);
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const overdueTasks = tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    ).length;
    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const totalComments = db.comments.filter((c) => tasks.some((t) => t.id === c.taskId)).length;

    return NextResponse.json({
        data: {
            totalTasks,
            doneTasks,
            overdueTasks,
            completionRate,
            totalComments,
            tasksByStatus: {
                todo: tasks.filter((t) => t.status === "todo").length,
                "in-progress": tasks.filter((t) => t.status === "in-progress").length,
                review: tasks.filter((t) => t.status === "review").length,
                done: doneTasks,
            },
        },
        error: null,
    });
}

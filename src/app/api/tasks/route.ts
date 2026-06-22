import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {getUserById, generateId, simulateDelay, logActivity} from "@/lib/mock-db.helpers";
import {createTaskSchema} from "@/features/tasks/schemas/task.schema";
import type {PopulatedTask} from "@/features/tasks/types/task.type";

function buildPopulated(task: typeof db.tasks[0]): PopulatedTask {
    const assignee = task.assigneeId ? getUserById(task.assigneeId) : null;
    const {assigneeId, ...rest} = task;
    void assigneeId;
    return {
        ...rest,
        assignee: assignee ? {id: assignee.id, name: assignee.name, avatarUrl: assignee.avatarUrl} : null,
    };
}

export async function GET(req: NextRequest) {
    await simulateDelay();
    const {searchParams} = req.nextUrl;
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assigneeId = searchParams.get("assigneeId");

    let results = [...db.tasks];
    if (projectId) results = results.filter((t) => t.projectId === projectId);
    if (status) results = results.filter((t) => t.status === status);
    if (priority) results = results.filter((t) => t.priority === priority);
    if (assigneeId) results = results.filter((t) => t.assigneeId === assigneeId);

    return NextResponse.json({data: results.map(buildPopulated), meta: {total: results.length}, error: null});
}

export async function POST(req: NextRequest) {
    await simulateDelay();
    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "Validation failed",
                    code: "VALIDATION_ERROR",
                    fieldErrors: parsed.error.flatten().fieldErrors,
                },
            },
            {status: 422}
        );
    }
    const now = new Date().toISOString();
    const newTask = {...parsed.data, id: generateId("t"), createdAt: now, updatedAt: now};
    db.tasks.unshift(newTask);

    logActivity({
        action: "created",
        message: `Task '${newTask.title}' was created`,
        entityType: "task",
        entityId: newTask.id,
        actorId: "u1",
    });

    return NextResponse.json({data: buildPopulated(newTask), error: null}, {status: 201});
}

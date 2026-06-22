import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {getUserById, simulateDelay, logActivity} from "@/lib/mock-db.helpers";
import {updateTaskSchema} from "@/features/tasks/schemas/task.schema";
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

export async function GET(_req: NextRequest, {params}: {params: {id: string}}) {
    await simulateDelay();
    const task = db.tasks.find((t) => t.id === params.id);
    if (!task)
        return NextResponse.json({data: null, error: {message: "Task not found", code: "NOT_FOUND"}}, {status: 404});
    return NextResponse.json({data: buildPopulated(task), error: null});
}

export async function PATCH(req: NextRequest, {params}: {params: {id: string}}) {
    await simulateDelay();
    const index = db.tasks.findIndex((t) => t.id === params.id);
    if (index === -1)
        return NextResponse.json({data: null, error: {message: "Task not found", code: "NOT_FOUND"}}, {status: 404});
    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);
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
    db.tasks[index] = {...db.tasks[index], ...parsed.data, updatedAt: new Date().toISOString()};
    logActivity({
        action: "updated",
        message: `Task '${db.tasks[index].title}' was updated`,
        entityType: "task",
        entityId: db.tasks[index].id,
        actorId: "u1",
    });
    return NextResponse.json({data: buildPopulated(db.tasks[index]), error: null});
}

export async function DELETE(_req: NextRequest, {params}: {params: {id: string}}) {
    await simulateDelay();
    const index = db.tasks.findIndex((t) => t.id === params.id);
    if (index === -1)
        return NextResponse.json({data: null, error: {message: "Task not found", code: "NOT_FOUND"}}, {status: 404});
    const [deleted] = db.tasks.splice(index, 1);
    logActivity({
        action: "deleted",
        message: `Task '${deleted.title}' was deleted`,
        entityType: "task",
        entityId: deleted.id,
        actorId: "u1",
    });
    return NextResponse.json({data: {id: deleted.id}, error: null});
}

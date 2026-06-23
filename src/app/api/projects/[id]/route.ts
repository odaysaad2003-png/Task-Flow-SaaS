import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {getUserById, getClientById, simulateDelay, logActivity} from "@/lib/mock-db.helpers";
import {updateProjectSchema} from "@/features/projects/schemas/project.schema";
import type {PopulatedProject} from "@/features/projects/types/project.type";

type ProjectRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function buildPopulated(project: typeof db.projects[0]): PopulatedProject {
    const client = getClientById(project.clientId)!;
    const owner = getUserById(project.ownerId)!;

    const {clientId, ownerId, ...rest} = project;

    void clientId;
    void ownerId;

    return {
        ...rest,
        client,
        owner: {
            id: owner.id,
            name: owner.name,
            avatarUrl: owner.avatarUrl,
        },
    };
}

export async function GET(_req: NextRequest, {params}: ProjectRouteContext) {
    await simulateDelay();

    const {id} = await params;

    const project = db.projects.find((p) => p.id === id);

    if (!project) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "Project not found",
                    code: "NOT_FOUND",
                },
            },
            {status: 404}
        );
    }

    return NextResponse.json({
        data: buildPopulated(project),
        error: null,
    });
}

export async function PATCH(req: NextRequest, {params}: ProjectRouteContext) {
    await simulateDelay();

    const {id} = await params;

    const index = db.projects.findIndex((p) => p.id === id);

    if (index === -1) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "Project not found",
                    code: "NOT_FOUND",
                },
            },
            {status: 404}
        );
    }

    const body = await req.json();
    const parsed = updateProjectSchema.safeParse(body);

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

    db.projects[index] = {
        ...db.projects[index],
        ...parsed.data,
        updatedAt: new Date().toISOString(),
    };

    logActivity({
        action: "updated",
        message: `Project '${db.projects[index].name}' was updated`,
        entityType: "project",
        entityId: db.projects[index].id,
        actorId: "u1",
    });

    return NextResponse.json({
        data: buildPopulated(db.projects[index]),
        error: null,
    });
}

export async function DELETE(_req: NextRequest, {params}: ProjectRouteContext) {
    await simulateDelay();

    const {id} = await params;

    const index = db.projects.findIndex((p) => p.id === id);

    if (index === -1) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "Project not found",
                    code: "NOT_FOUND",
                },
            },
            {status: 404}
        );
    }

    const [deleted] = db.projects.splice(index, 1);

    logActivity({
        action: "deleted",
        message: `Project '${deleted.name}' was deleted`,
        entityType: "project",
        entityId: deleted.id,
        actorId: "u1",
    });

    return NextResponse.json({
        data: {
            id: deleted.id,
        },
        error: null,
    });
}

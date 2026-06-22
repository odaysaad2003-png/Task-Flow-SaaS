import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {getUserById, getClientById, generateId, simulateDelay, logActivity} from "@/lib/mock-db.helpers";
import {createProjectSchema} from "@/features/projects/schemas/project.schema";
import type {PopulatedProject} from "@/features/projects/types/project.type";

function buildPopulated(project: typeof db.projects[0]): PopulatedProject {
    const client = getClientById(project.clientId)!;
    const owner = getUserById(project.ownerId)!;
    const {clientId, ownerId, ...rest} = project;
    void clientId;
    void ownerId;
    return {
        ...rest,
        client,
        owner: {id: owner.id, name: owner.name, avatarUrl: owner.avatarUrl},
    };
}

export async function GET(req: NextRequest) {
    await simulateDelay();

    const {searchParams} = req.nextUrl;
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));

    let results = [...db.projects];

    if (status) results = results.filter((p) => p.status === status);
    if (clientId) results = results.filter((p) => p.clientId === clientId);
    if (priority) results = results.filter((p) => p.priority === priority);
    if (search) {
        const q = search.toLowerCase();
        results = results.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = results.slice((page - 1) * limit, page * limit);
    const populated = paginated.map(buildPopulated);

    return NextResponse.json({
        data: populated,
        meta: {page, limit, total, totalPages},
        error: null,
    });
}

export async function POST(req: NextRequest) {
    await simulateDelay();
    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);

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
    const newProject = {
        ...parsed.data,
        id: generateId("p"),
        createdAt: now,
        updatedAt: now,
        // ownerId يأتي من الجلسة الوهمية في Sprint القادم — مؤقتاً u1
        ownerId: "u1",
    };
    db.projects.unshift(newProject);

    logActivity({
        action: "created",
        message: `Project '${newProject.name}' was created`,
        entityType: "project",
        entityId: newProject.id,
        actorId: "u1",
    });

    return NextResponse.json({data: buildPopulated(newProject), error: null}, {status: 201});
}

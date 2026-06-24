import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {simulateDelay} from "@/lib/mock-db.helpers";
import {updateClientSchema} from "@/features/clients/schemas/client.schema";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_req: NextRequest, {params}: RouteContext) {
    await simulateDelay(200);

    const {id} = await params;

    const client = db.clients.find((c) => c.id === id);

    if (!client) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "العميل غير موجود",
                    code: "NOT_FOUND",
                },
            },
            {status: 404}
        );
    }

    return NextResponse.json({
        data: client,
        error: null,
    });
}

export async function PATCH(req: NextRequest, {params}: RouteContext) {
    await simulateDelay();

    const {id} = await params;

    const index = db.clients.findIndex((c) => c.id === id);

    if (index === -1) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "العميل غير موجود",
                    code: "NOT_FOUND",
                },
            },
            {status: 404}
        );
    }

    const body = await req.json();

    const parsed = updateClientSchema.safeParse(body);

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

    db.clients[index] = {
        ...db.clients[index],
        ...parsed.data,
    };

    return NextResponse.json({
        data: db.clients[index],
        error: null,
    });
}

export async function DELETE(_req: NextRequest, {params}: RouteContext) {
    await simulateDelay();

    const {id} = await params;

    const index = db.clients.findIndex((c) => c.id === id);

    if (index === -1) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "العميل غير موجود",
                    code: "NOT_FOUND",
                },
            },
            {status: 404}
        );
    }

    const [deleted] = db.clients.splice(index, 1);

    return NextResponse.json({
        data: {
            id: deleted.id,
        },
        error: null,
    });
}

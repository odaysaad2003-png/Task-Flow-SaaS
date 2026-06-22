import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {generateId, simulateDelay} from "@/lib/mock-db.helpers";
import {createClientSchema} from "@/features/clients/schemas/client.schema";

export async function GET(req: NextRequest) {
    await simulateDelay();
    const search = req.nextUrl.searchParams.get("search");
    const status = req.nextUrl.searchParams.get("status");
    let results = [...db.clients];
    if (status) results = results.filter((c) => c.status === status);
    if (search) {
        const q = search.toLowerCase();
        results = results.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
    }
    return NextResponse.json({data: results, error: null});
}

export async function POST(req: NextRequest) {
    await simulateDelay();
    const body = await req.json();
    const parsed = createClientSchema.safeParse(body);
    if (!parsed.success)
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
    const newClient = {...parsed.data, id: generateId("c"), createdAt: new Date().toISOString()};
    db.clients.push(newClient);
    return NextResponse.json({data: newClient, error: null}, {status: 201});
}

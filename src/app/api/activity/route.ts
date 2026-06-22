import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {getUserById, simulateDelay} from "@/lib/mock-db.helpers";

export async function GET(req: NextRequest) {
    await simulateDelay(200);
    const entityType = req.nextUrl.searchParams.get("entityType");
    const entityId = req.nextUrl.searchParams.get("entityId");
    const limit = Math.min(50, Number(req.nextUrl.searchParams.get("limit") ?? "20"));

    let results = [...db.activityLogs];
    if (entityType) results = results.filter((a) => a.entityType === entityType);
    if (entityId) results = results.filter((a) => a.entityId === entityId);
    results = results.slice(0, limit);

    const populated = results.map((a) => {
        const actor = getUserById(a.actorId)!;
        const {actorId, ...rest} = a;
        void actorId;
        return {...rest, actor: {id: actor.id, name: actor.name, avatarUrl: actor.avatarUrl}};
    });
    return NextResponse.json({data: populated, error: null});
}

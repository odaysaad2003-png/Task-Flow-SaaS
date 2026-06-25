import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {simulateDelay, logActivity} from "@/lib/mock-db.helpers";

type RouteContext = {
    params: Promise<{id: string}>;
};

export async function DELETE(_req: NextRequest, context: RouteContext) {
    const {id} = await context.params;
    await simulateDelay(250);

    const index = db.comments.findIndex((c) => c.id === id);

    if (index === -1) {
        return NextResponse.json({data: null, error: {message: "التعليق غير موجود", code: "NOT_FOUND"}}, {status: 404});
    }

    const [deleted] = db.comments.splice(index, 1);

    logActivity({
        action: "deleted",
        message: `تم حذف تعليق من المهمة`,
        entityType: "comment",
        entityId: deleted.id,
        actorId: "u1",
    });

    return NextResponse.json({data: {id: deleted.id}, error: null});
}

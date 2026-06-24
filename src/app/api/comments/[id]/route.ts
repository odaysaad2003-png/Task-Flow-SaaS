import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {simulateDelay, logActivity} from "@/lib/mock-db.helpers";

export async function DELETE(_req: NextRequest, {params}: {params: {id: string}}) {
    await simulateDelay(250);

    const index = db.comments.findIndex((c) => c.id === params.id);

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

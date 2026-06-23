import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";

export async function GET(req: NextRequest) {
    const uid = req.cookies.get("taskflow_uid")?.value;

    if (!uid) {
        return NextResponse.json({data: null, error: {message: "غير مصرح", code: "UNAUTHORIZED"}}, {status: 401});
    }

    const user = db.users.find((u) => u.id === uid);

    if (!user) {
        return NextResponse.json(
            {data: null, error: {message: "المستخدم غير موجود", code: "NOT_FOUND"}},
            {status: 404}
        );
    }

    return NextResponse.json({data: user, error: null});
}

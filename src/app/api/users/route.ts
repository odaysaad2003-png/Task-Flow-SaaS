import {NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {simulateDelay} from "@/lib/mock-db.helpers";

export async function GET() {
    await simulateDelay(150);
    const safeUsers = db.users.map(({id, name, email, avatarUrl, role}) => ({id, name, email, avatarUrl, role}));
    return NextResponse.json({data: safeUsers, error: null});
}

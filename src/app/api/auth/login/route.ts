import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {simulateDelay} from "@/lib/mock-db.helpers";
import {loginSchema} from "@/features/auth/schemas/auth.schema";

const MOCK_PASSWORD = "password123";

export async function POST(req: NextRequest) {
    await simulateDelay(600);

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "بيانات غير صحيحة",
                    code: "VALIDATION_ERROR",
                    fieldErrors: parsed.error.flatten().fieldErrors,
                },
            },
            {status: 422}
        );
    }

    const {email, password} = parsed.data;
    const user = db.users.find((u) => u.email === email.toLowerCase());

    if (!user || password !== MOCK_PASSWORD) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
                    code: "INVALID_CREDENTIALS",
                },
            },
            {status: 401}
        );
    }

    const token = `mock_token.${user.id}.${Date.now()}`;

    const response = NextResponse.json({data: {user, token}, error: null});

    response.cookies.set("taskflow_uid", user.id, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 أيام
        path: "/",
        sameSite: "lax",
    });

    return response;
}

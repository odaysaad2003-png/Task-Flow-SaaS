import {NextResponse} from "next/server";

export async function POST() {
    const response = NextResponse.json({
        data: {success: true},
        error: null,
    });
    response.cookies.delete("taskflow_uid");
    return response;
}

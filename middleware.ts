import {NextRequest, NextResponse} from "next/server";

const PUBLIC_ROUTES = ["/login"];
const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";
const DEFAULT_UNAUTHENTICATED_REDIRECT = "/login";

export function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;
    const uid = req.cookies.get("taskflow_uid")?.value;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    // API routes: لا تعديل
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // صفحات عامة لكن المستخدم مسجّل → أرسله للداشبورد
    if (uid && isPublicRoute) {
        return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_REDIRECT, req.url));
    }

    // صفحات محمية والمستخدم غير مسجّل → أرسله للـ login
    if (!uid && !isPublicRoute) {
        const loginUrl = new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, req.url);
        // احفظ الـ URL الأصلي للعودة إليه بعد تسجيل الدخول
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

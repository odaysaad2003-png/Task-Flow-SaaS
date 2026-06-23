"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckCircle2, Layers, Lock, Mail, Zap} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {loginSchema, type LoginInput} from "@/features/auth/schemas/auth.schema";
import {useLogin} from "@/features/auth/hooks/use-login";
import {cn} from "@/lib/utils";

// ─── حسابات تجريبية للاختبار السريع ──────────────────────────────────────────
const TEST_ACCOUNTS: {
    label: string;
    email: string;
    role: string;
    description: string;
    color: string;
}[] = [
    {
        label: "مدير النظام",
        email: "admin@taskflow.dev",
        role: "Admin",
        description: "صلاحيات كاملة",
        color: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300",
    },
    {
        label: "عضو الفريق",
        email: "sara@taskflow.dev",
        role: "Member",
        description: "إنشاء وتعديل",
        color: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    },
    {
        label: "مشاهد",
        email: "lina@taskflow.dev",
        role: "Viewer",
        description: "عرض فقط",
        color: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
    },
];

const FEATURES = [
    "إدارة المشاريع والمهام بكفاءة عالية",
    "تتبع أداء الفريق في الوقت الفعلي",
    "سجل نشاط كامل ومفصّل",
    "تحكم دقيق بالصلاحيات والأدوار",
];

export default function LoginPage() {
    const {mutate: login, isPending} = useLogin();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: "", password: ""},
    });

    function onSubmit(data: LoginInput) {
        login(data);
    }

    function fillAndLogin(email: string) {
        form.setValue("email", email);
        form.setValue("password", "password123");
        login({email, password: "password123"});
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* ─── اللوحة اليسرى — العلامة التجارية ─────────────────────────────── */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 lg:flex">
                {/* خلفية دائرات ضبابية */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
                </div>

                {/* الشعار */}
                <div className="relative flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
                        <Layers className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
                </div>

                {/* المحتوى الرئيسي */}
                <div className="relative space-y-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1">
                            <Zap className="h-3.5 w-3.5 text-violet-400" />
                            <span className="text-xs font-medium text-violet-300">
                                مشروع تدريبي — جسر Frontend إلى Backend
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight text-white">
                            أدر مشاريعك.
                            <br />
                            <span className="text-violet-400">وحّد فريقك.</span>
                            <br />
                            أنجز المهام.
                        </h1>
                        <p className="text-base text-slate-400 leading-relaxed">
                            منصة SaaS متكاملة مبنية بأحدث تقنيات React وNext.js لتعلم معمارية الفرونت إند الاحترافية.
                        </p>
                    </div>

                    <ul className="space-y-3">
                        {FEATURES.map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-400" />
                                <span className="text-sm text-slate-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* الفوتر */}
                <div className="relative text-xs text-slate-600">TaskFlow SaaS — Sprint 2 of 10</div>
            </div>

            {/* ─── اللوحة اليمنى — نموذج الدخول ─────────────────────────────────── */}
            <div className="flex items-center justify-center bg-background p-8">
                <div className="w-full max-w-sm space-y-8">
                    {/* شعار للموبايل */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                            <Layers className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold">TaskFlow</span>
                    </div>

                    {/* عنوان الفورم */}
                    <div className="space-y-1.5">
                        <h2 className="text-2xl font-bold tracking-tight">مرحبًا بعودتك</h2>
                        <p className="text-sm text-muted-foreground">سجّل الدخول للوصول إلى لوحة التحكم</p>
                    </div>

                    {/* فورم تسجيل الدخول */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pr-10 text-left"
                                    dir="ltr"
                                    disabled={isPending}
                                    {...form.register("email")}
                                />
                            </div>
                            {form.formState.errors.email && (
                                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pr-10"
                                    disabled={isPending}
                                    {...form.register("password")}
                                />
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={isPending}>
                            {isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                        </Button>
                    </form>

                    {/* دخول سريع للاختبار */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Separator className="flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">دخول سريع للاختبار</span>
                            <Separator className="flex-1" />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {TEST_ACCOUNTS.map((account) => (
                                <button
                                    key={account.email}
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => fillAndLogin(account.email)}
                                    className={cn(
                                        "flex flex-col items-center gap-1 rounded-lg border px-2 py-3",
                                        "text-center transition-colors duration-200 disabled:opacity-50",
                                        account.color
                                    )}
                                >
                                    <span className="text-xs font-semibold">{account.label}</span>
                                    <span className="text-[10px] opacity-75">{account.description}</span>
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-[11px] text-muted-foreground">
                            كلمة المرور لجميع الحسابات:{" "}
                            <code className="rounded bg-muted px-1 font-mono">password123</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {simulateDelay} from "@/lib/mock-db.helpers";

export async function GET(req: NextRequest) {
    await simulateDelay(400);

    const uid = req.cookies.get("taskflow_uid")?.value;

    // إحصائيات المشاريع
    const totalProjects = db.projects.length;
    const activeProjects = db.projects.filter((p) => p.status === "active").length;
    const completedProjects = db.projects.filter((p) => p.status === "completed").length;

    // إحصائيات المهام
    const totalTasks = db.tasks.length;
    const myTasks = uid ? db.tasks.filter((t) => t.assigneeId === uid).length : 0;
    const overdueTasks = db.tasks.filter((t) => {
        if (!t.dueDate || t.status === "done") return false;
        return new Date(t.dueDate) < new Date();
    }).length;

    // توزيع المهام حسب الحالة
    const tasksByStatus = {
        todo: db.tasks.filter((t) => t.status === "todo").length,
        "in-progress": db.tasks.filter((t) => t.status === "in-progress").length,
        review: db.tasks.filter((t) => t.status === "review").length,
        done: db.tasks.filter((t) => t.status === "done").length,
    };

    // نسبة الإنجاز الإجمالية
    const completionRate = totalTasks > 0 ? Math.round((tasksByStatus.done / totalTasks) * 100) : 0;

    // إحصائيات الأعضاء والعملاء
    const totalClients = db.clients.filter((c) => c.status === "active").length;
    const totalMembers = db.users.length;

    return NextResponse.json({
        data: {
            projects: {
                total: totalProjects,
                active: activeProjects,
                completed: completedProjects,
            },
            tasks: {
                total: totalTasks,
                myTasks,
                overdue: overdueTasks,
                byStatus: tasksByStatus,
            },
            completionRate,
            totalClients,
            totalMembers,
        },
        error: null,
    });
}

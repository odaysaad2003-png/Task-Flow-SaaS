// في src/app/api/dashboard/recent/route.ts
import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {getUserById, getClientById, simulateDelay} from "@/lib/mock-db.helpers";

export async function GET(req: NextRequest) {
    await simulateDelay(300);
    const uid = req.cookies.get("taskflow_uid")?.value;
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? "5");

    // آخر المشاريع
    const recentProjects = db.projects.slice(0, 4).map((p) => {
        const client = db.clients.find((c) => c.id === p.clientId)!;
        const owner = getUserById(p.ownerId)!;
        const {clientId, ownerId, ...rest} = p;
        void clientId;
        void ownerId;
        return {
            ...rest,
            client,
            owner: {id: owner.id, name: owner.name, avatarUrl: owner.avatarUrl},
        };
    });

    // آخر المهام
    const recentTasks = db.tasks.slice(0, limit).map((t) => {
        const assignee = t.assigneeId ? getUserById(t.assigneeId) : null;
        const {assigneeId, ...rest} = t;
        void assigneeId;
        return {
            ...rest,
            assignee: assignee ? {id: assignee.id, name: assignee.name, avatarUrl: assignee.avatarUrl} : null,
        };
    });

    // آخر الأنشطة
    const activityFeed = db.activityLogs.slice(0, 8).map((a) => {
        const actor = getUserById(a.actorId)!;
        const {actorId, ...rest} = a;
        void actorId;
        return {
            ...rest,
            actor: {id: actor.id, name: actor.name, avatarUrl: actor.avatarUrl},
        };
    });

    // مهام المستخدم الحالي
    const myTasks = uid
        ? db.tasks
          .filter((t) => t.assigneeId === uid && t.status !== "done")
          .slice(0, 3)
          .map((t) => {
              const assignee = getUserById(uid);
              const {assigneeId, ...rest} = t;
              void assigneeId;
              return {
                  ...rest,
                  assignee: assignee ? {id: assignee.id, name: assignee.name, avatarUrl: assignee.avatarUrl} : null,
              };
          })
        : [];

    return NextResponse.json({
        data: {recentProjects, recentTasks, activityFeed, myTasks},
        error: null,
    });
}

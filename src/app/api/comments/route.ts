import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/mock-db";
import {getUserById, generateId, simulateDelay, logActivity} from "@/lib/mock-db.helpers";
import {createCommentSchema} from "@/features/comments/schemas/comment.schema";

export async function GET(req: NextRequest) {
    await simulateDelay(150);
    const taskId = req.nextUrl.searchParams.get("taskId");
    const results = taskId ? db.comments.filter((c) => c.taskId === taskId) : db.comments;
    const populated = results.map((c) => {
        const author = getUserById(c.authorId)!;
        const {authorId, ...rest} = c;
        void authorId;
        return {...rest, author: {id: author.id, name: author.name, avatarUrl: author.avatarUrl}};
    });
    return NextResponse.json({data: populated, error: null});
}

export async function POST(req: NextRequest) {
    await simulateDelay();
    const body = await req.json();
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: "Validation failed",
                    code: "VALIDATION_ERROR",
                    fieldErrors: parsed.error.flatten().fieldErrors,
                },
            },
            {status: 422}
        );
    }
    const newComment = {...parsed.data, id: generateId("cm"), authorId: "u1", createdAt: new Date().toISOString()};
    db.comments.push(newComment);
    logActivity({
        action: "commented",
        message: "A new comment was added",
        entityType: "comment",
        entityId: newComment.id,
        actorId: "u1",
    });
    const author = getUserById("u1")!;
    const {authorId, ...rest} = newComment;
    void authorId;
    return NextResponse.json(
        {data: {...rest, author: {id: author.id, name: author.name, avatarUrl: author.avatarUrl}}, error: null},
        {status: 201}
    );
}

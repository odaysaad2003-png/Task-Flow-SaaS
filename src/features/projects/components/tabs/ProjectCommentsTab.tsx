"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {motion, AnimatePresence} from "framer-motion";
import {Send, Trash2, MessageSquare, Loader2} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Skeleton} from "@/components/ui/skeleton";
import {EmptyState} from "@/components/shared/EmptyState";
import {useComments} from "@/features/comments/hooks/use-comments";
import {useCreateComment} from "@/features/comments/hooks/use-create-comment";
import {useDeleteComment} from "@/features/comments/hooks/use-delete-comment";
import {useAuth} from "@/features/auth/hooks/use-auth";
import {useTasks} from "@/features/tasks/hooks/use-tasks";
import {createCommentSchema, type CreateCommentInput} from "@/features/comments/schemas/comment.schema";
import {cn} from "@/lib/utils";

interface ProjectCommentsTabProps {
    projectId: string;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `منذ ${days}d`;
    if (hours > 0) return `منذ ${hours}h`;
    if (mins > 0) return `منذ ${mins}m`;
    return "الآن";
}

// مكوّن التعليق الواحد مع Optimistic indicator
function CommentItem({
    comment,
    taskId,
    currentUserId,
}: {
    comment: {
        id: string;
        content: string;
        author: {id: string; name: string; avatarUrl: string | null};
        createdAt: string;
    };
    taskId: string;
    currentUserId?: string;
}) {
    const {mutate: deleteComment, isPending} = useDeleteComment(taskId);
    const isOptimistic = comment.id.startsWith("temp_");
    const isOwner = comment.author.id === currentUserId || isOptimistic;

    return (
        <motion.div
            layout
            initial={{opacity: 0, y: 8}}
            animate={{opacity: isOptimistic ? 0.6 : 1, y: 0}}
            exit={{opacity: 0, scale: 0.97}}
            transition={{duration: 0.2}}
            className={cn("flex gap-3 group", isOptimistic && "pointer-events-none")}
        >
            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                <AvatarImage src={comment.author.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xs">{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold">{comment.author.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                        {isOptimistic ? "جارٍ الإرسال..." : timeAgo(comment.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-foreground/90 mt-1 leading-relaxed">{comment.content}</p>
            </div>
            {isOwner && !isOptimistic && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => deleteComment(comment.id)}
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
            )}
        </motion.div>
    );
}

// مكوّن الـ Comment Thread لمهمة واحدة
function TaskCommentThread({taskId, taskTitle, projectId}: {taskId: string; taskTitle: string; projectId: string}) {
    const {user} = useAuth();
    const {data: comments, isLoading} = useComments(taskId);
    const createComment = useCreateComment(taskId);
    const [isExpanded, setIsExpanded] = useState(false);

    const form = useForm<CreateCommentInput>({
        resolver: zodResolver(createCommentSchema),
        defaultValues: {content: "", taskId},
    });

    function onSubmit(data: CreateCommentInput) {
        createComment.mutate(data, {
            onSuccess: () => form.reset({content: "", taskId}),
        });
    }

    return (
        <div className="rounded-2xl border bg-card overflow-hidden">
            {/* Task Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-right"
            >
                <span className="text-sm font-medium">{taskTitle}</span>
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {isLoading ? "..." : comments?.length ?? 0} تعليق
                </span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.25, ease: "easeInOut"}}
                        className="overflow-hidden"
                    >
                        <div className="border-t px-4 py-4 space-y-4">
                            {/* قائمة التعليقات */}
                            {isLoading ? (
                                <div className="space-y-3">
                                    {Array.from({length: 2}).map((_, i) => (
                                        <div key={i} className="flex gap-3 animate-pulse">
                                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                            <div className="flex-1 space-y-1.5">
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-4 w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : !comments?.length ? (
                                <p className="text-xs text-muted-foreground text-center py-3">
                                    لا توجد تعليقات بعد — كن أول من يعلّق
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {comments.map((comment) => (
                                            <CommentItem
                                                key={comment.id}
                                                comment={comment}
                                                taskId={taskId}
                                                currentUserId={user?.id}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* فورم إضافة تعليق */}
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2.5 pt-2 border-t">
                                <Avatar className="h-7 w-7 shrink-0 mt-1">
                                    <AvatarImage src={user?.avatarUrl ?? undefined} />
                                    <AvatarFallback className="text-[10px]">{user?.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder="اكتب تعليقاً..."
                                        rows={2}
                                        className="resize-none text-sm"
                                        disabled={createComment.isPending}
                                        {...form.register("content")}
                                    />
                                    {form.formState.errors.content && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.content.message}
                                        </p>
                                    )}
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="gap-1.5 bg-violet-600 hover:bg-violet-700"
                                            disabled={createComment.isPending || !form.watch("content")}
                                        >
                                            {createComment.isPending ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Send className="h-3.5 w-3.5" />
                                            )}
                                            إرسال
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function ProjectCommentsTab({projectId}: ProjectCommentsTabProps) {
    const {data: tasks, isLoading} = useTasks({projectId});

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({length: 3}).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!tasks?.length) {
        return (
            <EmptyState
                icon={MessageSquare}
                title="لا توجد مهام للتعليق عليها"
                message="أضف مهاماً للمشروع أولاً لتتمكن من إضافة تعليقات"
            />
        );
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="space-y-3"
        >
            {tasks.map((task) => (
                <TaskCommentThread key={task.id} taskId={task.id} taskTitle={task.title} projectId={projectId} />
            ))}
        </motion.div>
    );
}

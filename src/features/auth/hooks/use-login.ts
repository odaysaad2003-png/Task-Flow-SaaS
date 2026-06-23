import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {authApi} from "@/features/auth/services/auth.api";
import {useAuth} from "@/features/auth/hooks/use-auth";
import {ApiClientError} from "@/lib/api-client";

export function useLogin() {
    const router = useRouter();
    const {login} = useAuth();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (session) => {
            login(session);
            toast.success(`مرحبًا، ${session.user.name}!`);
            router.push("/dashboard");
        },
        onError: (error) => {
            if (error instanceof ApiClientError) {
                toast.error(error.message);
            } else {
                toast.error("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
            }
        },
    });
}

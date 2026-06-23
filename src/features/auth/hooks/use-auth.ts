import {useAuthContext} from "@/features/auth/context/auth-context";

// الـ hook الرئيسي — أي component يحتاج بيانات المستخدم يستخدم هذا
export function useAuth() {
    return useAuthContext();
}

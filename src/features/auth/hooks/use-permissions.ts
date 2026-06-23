import {useCallback} from "react";
import {can, type Permission} from "@/config/rolse";
import {useAuth} from "@/features/auth/hooks/use-auth";

export function usePermissions() {
    const {user} = useAuth();

    const canDo = useCallback(
        (permission: Permission): boolean => {
            if (!user) return false;
            return can(user.role, permission);
        },
        [user]
    );

    return {can: canDo};
}

export interface ApiError {
    message: string;
    code: string;
    fieldErrors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
    data: T;
    error: null;
}

export interface ApiErrorResponse {
    data: null;
    error: ApiError;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
    error: null;
}

export type AsyncState = "idle" | "loading" | "success" | "error";

import type {ApiError} from "@/types/shared.type";

class ApiClientError extends Error {
    code: string;
    fieldErrors?: Record<string, string[]>;
    status: number;

    constructor(error: ApiError, status: number) {
        super(error.message);
        this.code = error.code;
        this.fieldErrors = error.fieldErrors;
        this.status = status;
    }
}

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
    const url = new URL(path, typeof window === "undefined" ? "http://localhost" : window.location.origin);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.set(key, String(value));
        });
    }
    return url.pathname + url.search;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const {params, headers, ...rest} = options;

    const res = await fetch(buildUrl(path, params), {...rest, headers: { "Content-Type": "application/json", ...headers,},});

    const json = await res.json();

    if (!res.ok) {
        throw new ApiClientError(json.error, res.status);
    }

    return json.data as T;
}

export const apiClient = {
    get: <T>(path: string, options?: RequestOptions) => request<T>(path, {...options, method: "GET"}),  // get ((path,option)=>request) (path , {..option,method})

    post: <T>(path: string, body: unknown, options?: RequestOptions) =>
        request<T>(path, {...options, method: "POST", body: JSON.stringify(body)}),

    patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
        request<T>(path, {...options, method: "PATCH", body: JSON.stringify(body)}),

    delete: <T>(path: string, options?: RequestOptions) => request<T>(path, {...options, method: "DELETE"}),
};

export {ApiClientError};

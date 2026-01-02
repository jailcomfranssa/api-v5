// src/types/pagination.ts
export interface PaginationQuery {
    page: number;
    limit: number;
    search?: string;
    orderBy: string;
    order: "asc" | "desc";
}

export interface FindAllOptions {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
}

export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

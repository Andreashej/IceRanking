import { Task } from './task.model';
import { User } from './user.model';

export type Pagination = {
    page: number;
    totalPages: number,
    perPage: number,
    hasNext: boolean,
    hasPrevious: boolean,
    previousPage: number | null,
    nextPage: number | null,
    totalItems: number;
}

export type ApiResponse<T> = {
    data: T;
    task?: Task;
    message?: string;
    pagination?: Pagination;
}

export type LoginResponse = Pick<ApiResponse<User>,'data'> & {
    accessToken: string;
    refreshToken: string;
}

export type ResourceGetter<T> = (id: number, params: URLSearchParams) => Promise<T>

export type ResourceListGetter<T> = (params: URLSearchParams) => Promise<[T[], Pagination?]>;
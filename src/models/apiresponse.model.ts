import { Task } from './task.model';

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
    task: Task;
    message: string;
    pagination: Pagination;
}
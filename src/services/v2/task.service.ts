import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from 'axios'
import { Task } from "../../models/task.model";

export const getTask = async (id: number, params?: URLSearchParams): Promise<Task> => {
    try { 
        const response = await apiV2.get<ApiResponse<Task>>(`/tasks/${id}`, {
            params
        });

        return response.data.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}

export const getTasks = async (params: URLSearchParams): Promise<[Task[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Task[]>>(`/tasks`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchTask = async (task: Task) => {
    try {
        const response = await apiV2.patch<ApiResponse<Task>>(`/riders/${task.id}`, task)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
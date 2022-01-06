import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from 'axios'
import { Test } from "../../models/test.model";
import { Result } from "../../models/result.model";

export const getTest = async (id: number, params?: URLSearchParams): Promise<Test> => {
    try { 
        const response = await apiV2.get<ApiResponse<Test>>(`/tests/${id}`, {
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

export const getTests = async (params: URLSearchParams): Promise<[Test[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Test[]>>(`/tests`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const getTestResults = async (id: number, params?: URLSearchParams ): Promise<[Result[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Result[]>>(`/tests/${id}/results`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
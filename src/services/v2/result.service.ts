
import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from 'axios'
import { Result } from "../../models/result.model";

export const getResult = async (id: number, params?: URLSearchParams): Promise<Result> => {
    try { 
        const response = await apiV2.get<ApiResponse<Result>>(`/results/${id}`, {
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

export const getResults = async (params: URLSearchParams): Promise<[Result[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Result[]>>(`/results`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchResult = async (rankinglist: Result) => {
    try {
        const response = await apiV2.patch<ApiResponse<Result>>(`/results/${rankinglist.id}`, rankinglist)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
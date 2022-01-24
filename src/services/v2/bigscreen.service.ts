import axios from "axios";
import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import { ScreenGroup } from "../../models/screengroup.model";

export const getScreenGroups = async (params?: URLSearchParams): Promise<[ScreenGroup[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<ScreenGroup[]>>(`/screengroups`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const getScreenGroup = async (id: number, params?: URLSearchParams): Promise<ScreenGroup> => {
    try {
        const response = await apiV2.get<ApiResponse<ScreenGroup>>(`/screengroups/${id}`, { params });

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const getScreens = async (params?: URLSearchParams): Promise<[Screen[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Screen[]>>(`/bigscreens`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
import axios from "axios";
import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import { BigScreen } from "../../models/bigscreen.model";
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

export const createScreenGroup = async(screenGroup: Partial<ScreenGroup>): Promise<ScreenGroup> => {
    try {
        const response = await apiV2.post<ApiResponse<ScreenGroup>>(`/screengroups`, screenGroup);

        return response.data.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const getScreens = async (params?: URLSearchParams): Promise<[BigScreen[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<BigScreen[]>>(`/bigscreens`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const getScreen = async (id: number, params?: URLSearchParams): Promise<BigScreen> => {
    try {
        const response = await apiV2.get<ApiResponse<BigScreen>>(`/bigscreens/${id}`, { params });

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchScreen = async (screen: Partial<BigScreen>): Promise<BigScreen> => {
    try {
        const response = await apiV2.patch<ApiResponse<BigScreen>>(`/bigscreens/${screen.id}`, screen)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const deleteScreen = async (screen: BigScreen): Promise<void> => {
    try {
        await apiV2.delete<ApiResponse<void>>(`/bigscreens/${screen.id}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchScreenGroup = async (screenGroup: Partial<ScreenGroup>): Promise<ScreenGroup> => {
    try {
        const response = await apiV2.patch<ApiResponse<ScreenGroup>>(`/screengroups/${screenGroup.id}`, screenGroup)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
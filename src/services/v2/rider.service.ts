import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from 'axios'
import { Rider } from "../../models/rider.model";

export const getRider = async (id: number, params?: URLSearchParams): Promise<Rider> => {
    try { 
        const response = await apiV2.get<ApiResponse<Rider>>(`/riders/${id}`, {
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

export const getRiders = async (params: URLSearchParams): Promise<[Rider[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Rider[]>>(`/riders`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchRider = async (rider: Rider) => {
    try {
        const response = await apiV2.patch<ApiResponse<Rider>>(`/riders/${rider.id}`, rider)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
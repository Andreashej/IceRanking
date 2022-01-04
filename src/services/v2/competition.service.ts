import { apiV2 } from ".";
import { Competition } from "../../models/competition.model";
import { ApiResponse } from "../../models/apiresponse.model";
import axios from 'axios'

export const getCompetition = async (id: number, params?: URLSearchParams): Promise<Competition> => {
    try { 
        const response = await apiV2.get<ApiResponse<Competition>>(`/competitions/${id}`, {
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

export const getCompetitions = async (params: URLSearchParams): Promise<Competition[]> => {
    try {
        const response = await apiV2.get<ApiResponse<Competition[]>>(`/competitions`, { params });

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchCompetition = async (competition: Competition) => {
    try {
        const response = await apiV2.patch<ApiResponse<Competition>>(`/competition/${competition.id}`, competition)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
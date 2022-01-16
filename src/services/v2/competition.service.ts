import { apiV2 } from ".";
import { Competition } from "../../models/competition.model";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from 'axios'
import { dateToString } from "../../tools";

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

export const getCompetitions = async (params: URLSearchParams): Promise<[Competition[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Competition[]>>(`/competitions`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchCompetition = async (competition: Competition) => {
    try {
        const response = await apiV2.patch<ApiResponse<Competition>>(`/competitions/${competition.id}`, {
            ...competition,
            firstDate: dateToString(competition.firstDate, 'Y-M-d'),
            lastDate: dateToString(competition.lastDate, 'Y-M-d')
        })

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
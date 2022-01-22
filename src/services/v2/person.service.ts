import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from 'axios'
import { Person } from "../../models/person.model";

export const getPerson = async (id: number, params?: URLSearchParams): Promise<Person> => {
    try { 
        const response = await apiV2.get<ApiResponse<Person>>(`/persons/${id}`, {
            params
        });

        return response.data.data
    } catch (error: unknown) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            return Promise.reject(error?.response?.data?.message ?? error.message)
        }
        return Promise.reject(error)
    }
}

export const getPersons = async (params: URLSearchParams): Promise<[Person[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Person[]>>(`/persons`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const patchPerson = async (rider: Person) => {
    try {
        const response = await apiV2.patch<ApiResponse<Person>>(`/persons/${rider.id}`, rider)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
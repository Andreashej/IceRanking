import axios from "axios";
import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import { Test } from "../../models/test.model";


export const getTestCatalog = async (params?: URLSearchParams): Promise<[Test[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<Test[]>>(`/test-catalog`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

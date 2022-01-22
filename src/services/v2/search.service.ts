import axios from "axios";
import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import { SearchResult } from "../../models/searchresult.model";

export const getSearchResults = async (params: URLSearchParams): Promise<[SearchResult[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<SearchResult[]>>(`/search`, { params });

        return [response.data.data, response.data.pagination];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
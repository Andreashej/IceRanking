import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from "axios";
import { RankingResult } from "../../models/rankingresult.model";
import { Result } from "../../models/result.model";

export const getRankingResult = async (
  id: string,
  params?: URLSearchParams
): Promise<RankingResult> => {
  try {
    const response = await apiV2.get<ApiResponse<RankingResult>>(
      `/rankingresults/${id}`,
      {
        params,
      }
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const getRankingResults = async (
  params: URLSearchParams
): Promise<[RankingResult[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<RankingResult[]>>(
      `/rankingresults`,
      { params }
    );

    return [response.data.items, response.data.pagination];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const getRankingResultMarks = async (
  resultId: string,
  params: URLSearchParams
): Promise<[Result[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<Result[]>>(
      `/rankingresults/${resultId}/marks`,
      { params }
    );

    return [response.data.data, response.data.pagination];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

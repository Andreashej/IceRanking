import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from "axios";
import { Ranking } from "../../models/ranking.model";
import { RankingResult } from "../../models/rankingresult.model";
import { RankingList } from "../../models/rankinglist.model";

export const getRanking = async (
  id: string,
  params?: URLSearchParams
): Promise<Ranking> => {
  try {
    const response = await apiV2.get<ApiResponse<Ranking>>(`/rankings/${id}`, {
      params,
    });

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const getRankings = async (
  params: URLSearchParams
): Promise<[Ranking[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<Ranking[]>>(`/rankings`, {
      params,
    });

    return [response.data.data, response.data.pagination];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const patchRanking = async (ranking: Ranking) => {
  try {
    const response = await apiV2.patch<ApiResponse<Ranking>>(
      `/rankings/${ranking.id}`,
      ranking
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const createRanking = async (
  rankingList: RankingList,
  ranking: Omit<Ranking, "id" | "rankinglistId">
) => {
  try {
    const response = await apiV2.post<ApiResponse<Ranking>>(
      `/rankinglists/${rankingList.id}/rankings`,
      ranking
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const getResultForRanking = async (
  id: string,
  params?: URLSearchParams
): Promise<[RankingResult[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<RankingResult[]>>(
      `/rankings/${id}/results`,
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

import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from "axios";
import { RankingList } from "../../models/rankinglist.model";

export const getRankingList = async (
  id: string,
  params?: URLSearchParams
): Promise<RankingList> => {
  try {
    const response = await apiV2.get<ApiResponse<RankingList>>(
      `/rankinglists/${id}`,
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

export const getRankingLists = async (
  params?: URLSearchParams
): Promise<[RankingList[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<RankingList[]>>(
      `/rankinglists`,
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

export const patchRankingList = async (rankinglist: RankingList) => {
  try {
    const response = await apiV2.patch<ApiResponse<RankingList>>(
      `/rankinglists/${rankinglist.id}`,
      rankinglist
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

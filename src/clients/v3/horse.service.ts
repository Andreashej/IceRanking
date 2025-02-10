import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from "axios";
import { Horse } from "../../models/horse.model";

export const getHorse = async (
  id: string,
  params?: URLSearchParams
): Promise<Horse> => {
  try {
    const response = await apiV2.get<ApiResponse<Horse>>(`/horses/${id}`, {
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

export const getHorses = async (
  params: URLSearchParams
): Promise<[Horse[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<Horse[]>>(`/horses`, {
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

export const patchHorse = async (horse: Horse) => {
  try {
    const response = await apiV2.patch<ApiResponse<Horse>>(
      `/horses/${horse.id}`,
      horse
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

import { apiV2 as apiV3 } from ".";
import { Competition } from "../../models/competition.model";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from "axios";
import { dateToString } from "../../tools";
import { User } from "../../models/user.model";

export const getCompetition = async (
  id: string,
  params?: URLSearchParams
): Promise<Competition> => {
  try {
    const response = await apiV3.get<Competition>(`/competitions/${id}`, {
      params,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const getCompetitions = async (
  params: URLSearchParams
): Promise<[Competition[], Pagination?]> => {
  try {
    const response = await apiV3.get<ApiResponse<Competition[]>>(
      `/competitions`,
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

export const createCompetition = async (competition: Partial<Competition>) => {
  try {
    if (!competition.startDate || !competition.endDate) {
      return Promise.reject("First and last date are required");
    }

    const response = await apiV3.post<ApiResponse<Competition>>(
      `/competitions`,
      {
        ...competition,
        firstDate: dateToString(competition.startDate, "Y-M-d"),
        lastDate: dateToString(competition.endDate, "Y-M-d"),
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

export const patchCompetition = async (competition: Competition) => {
  try {
    const firstDate = competition.startDate
      ? {
          firstDate: dateToString(competition.startDate, "Y-M-d"),
        }
      : {};

    const lastDate = competition.endDate
      ? {
          lastDate: dateToString(competition.endDate, "Y-M-d"),
        }
      : {};
    const response = await apiV3.patch<ApiResponse<Competition>>(
      `/competitions/${competition.id}`,
      {
        ...competition,
        ...firstDate,
        ...lastDate,
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

export const postCompetitionUsers = async (
  competition: Competition,
  username: string
): Promise<User> => {
  try {
    const response = await apiV3.post<ApiResponse<User>>(
      `/competitions/${competition.id}/users`,
      {
        username,
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

export const deleteCompetitionUser = async (
  competition: Competition,
  user: User
): Promise<void> => {
  try {
    await apiV3.delete<ApiResponse<User>>(
      `/competitions/${competition.id}/users/${user.id}`
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

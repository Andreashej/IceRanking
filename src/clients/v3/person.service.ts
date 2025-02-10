import { apiV2 } from ".";
import { ApiResponse, Pagination } from "../../models/apiresponse.model";
import axios from "axios";
import { Person } from "../../models/person.model";
import { PersonAlias } from "../../models/personalias.model";

export const getPerson = async (
  id: string,
  params?: URLSearchParams
): Promise<Person> => {
  try {
    const response = await apiV2.get<ApiResponse<Person>>(`/persons/${id}`, {
      params,
    });

    return response.data.data;
  } catch (error: unknown) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      return Promise.reject(error?.response?.data?.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const getPersons = async (
  params: URLSearchParams
): Promise<[Person[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<Person[]>>(`/persons`, {
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

export const patchPerson = async (person: Person) => {
  try {
    const response = await apiV2.patch<ApiResponse<Person>>(
      `/persons/${person.id}`,
      person
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

export const getAliases = async (
  person: Pick<Person, "id">,
  params?: URLSearchParams
): Promise<[PersonAlias[], Pagination?]> => {
  try {
    const response = await apiV2.get<ApiResponse<PersonAlias[]>>(
      `/persons/${person.id}/aliases`,
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

export const createAlias = async (
  person: Pick<Person, "id">,
  payload: { alias?: string; personId?: Person["id"] }
): Promise<PersonAlias> => {
  try {
    const response = await apiV2.post<ApiResponse<PersonAlias>>(
      `/persons/${person.id}/aliases`,
      payload
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data.message ?? error.message);
    }
    return Promise.reject(error);
  }
};

import { apiV2 } from ".";
import { ApiResponse, LoginResponse, Pagination } from "../../models/apiresponse.model";
import axios from 'axios'
import { User } from "../../models/user.model";
import { URLSearchParams } from "url";

export const login = async (username: string, password: string): Promise<User> => {
    try {
        const response = await apiV2.post<LoginResponse>('/login', { username, password });

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        return response.data.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}

export const logout = async (): Promise<void> => {
    try {
        await Promise.all([
            logoutAccessToken(),
            logoutRefreshToken()
        ]);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) return Promise.reject("No refresh token!");

    try {
        const response = await apiV2.post<Pick<LoginResponse,'accessToken'>>('/token/refresh', {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });

        localStorage.setItem('accessToken', response.data.accessToken);

        return response.data.accessToken
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}

export const logoutAccessToken = async (): Promise<void> => {
    try {
        await apiV2.post('/logout/access');
        localStorage.removeItem('accessToken');
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}

export const logoutRefreshToken = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) return Promise.reject("No refresh token!");

    try {
        await apiV2.post('/logout/refresh', {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        localStorage.removeItem('refreshToken');
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}

export const getProfile = async (params?: URLSearchParams): Promise<User> => {
    try {
        const response = await apiV2.get<ApiResponse<User>>('/profile', { params });

        return response.data.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}

export const patchUser = async (user: Partial<User>): Promise<User> => {
    try {
        const response = await apiV2.patch<ApiResponse<User>>(`/users/${user.id}`, user)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const createUser = async(username: string, password: string, firstName: string, lastName: string, email: string): Promise<User> => {
    try {
        const response = await apiV2.post<ApiResponse<User>>(`/users`, {
            username,
            password,
            firstName,
            lastName,
            email
        })

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}

export const getUsers = async (params?: URLSearchParams): Promise<[User[], Pagination?]> => {
    try {
        const response = await apiV2.get<ApiResponse<User[]>>('/users', { params });

        return [response.data.data, response.data.pagination];

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}
export const getUser = async (id: number, params?: URLSearchParams): Promise<User> => {
    try {
        const response = await apiV2.get<ApiResponse<User>>(`/users/${id}`, { params });

        return response.data.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error)
    }
}
import { apiV2 } from ".";
import { ApiResponse, LoginResponse } from "../../models/apiresponse.model";
import axios from 'axios'
import { User } from "../../models/user.model";

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

export const getProfile = async (): Promise<User> => {
    try {
        const response = await apiV2.get<ApiResponse<User>>('/profile');

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
        const response = await apiV2.patch<ApiResponse<User>>(`/competition/${user.id}`, user)

        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response?.data.message ?? error.message)
        }
        return Promise.reject(error);
    }
}
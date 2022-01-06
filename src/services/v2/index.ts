import axios from 'axios';
import { refreshAccessToken } from './auth.service';
import { handleDates } from './dates';

export const apiV2 = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/v2`,
});

apiV2.interceptors.response.use((res) => {
    handleDates(res.data);
    return res;
});

apiV2.interceptors.request.use((req) => {
    if (!req.url?.includes('refresh')) {
        const accessToken = localStorage.getItem('accessToken');
    
        if (accessToken) {
            req.headers = {
                ...req.headers,
                'Authorization': `Bearer ${accessToken}`
            }
        }
    }

    return req;
});

apiV2.interceptors.response.use((res) => res, async (error) => {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            if (error.config.url === '/token/refresh') return Promise.reject(error);
            try {
                const accessToken = await refreshAccessToken();

                error.config.headers = {
                    ...error.config.headers,
                    'Authorization': `Bearer ${accessToken}`
                }

                return axios.request(error.config);
            } catch (err) {
                return Promise.reject(error);
            }
        }
    }

    return error;
})
import axios from 'axios';
import authService from '../services/v1/auth.service';
import { logout } from '../actions';

export function getToken(refresh) {
    let token;
    if (!refresh) {
        token = localStorage.getItem('accessToken');
    } else {
        token = localStorage.getItem('refreshToken');
    }
    
    if (token) {
        return { 'Authorization': `Bearer ${token}`};
    } else {
        return { };
    }
}

const instance = axios.create({
    // baseURL: 'https://rankingapi.andreashej.dk/api',
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: {
        ...getToken()
    }
});

instance.interceptors.response.use( (response) => {
        // Return a successful response back to the calling service
        return response;
    }, (error) => {
        // Return any error which is not due to authentication back to the calling service
        if (error.response && error.response.status !== 401) {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }

        // Logout user if token refresh didn't work or user is disabled
        if (error.config.url === '/token/refresh') {
            
            logout();

            return new Promise((resolve, reject) => {
                reject(error);
            });
        }

        // Try request again with new token
        return authService.refreshToken()
            .then((token) => {
                // New request with new token
                const config = error.config;
                config.headers = { ...config.headers, token };

                return new Promise((resolve, reject) => {
                    axios.request(config).then(response => {
                        resolve(response);
                    }).catch((error) => {
                        reject(error);
                    })
                });

                }).catch((error) => {
                    Promise.reject(error);
                }
            );
});

export default instance;
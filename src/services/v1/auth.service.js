import rankingApi from '../../apis/ranking';
import { getToken } from '../../apis/ranking';

class AuthService {
    async login (username, password) {
        const response = await rankingApi.post('/login', {
            username,
            password
        });
        
        if (response.data.access_token) {
            localStorage.setItem("accessToken", response.data.access_token);
            localStorage.setItem("refreshToken", response.data.refresh_token);
        }

        return response.data.data;
    }

    async logout() {
        await rankingApi.post('/logout/access', {})
        localStorage.removeItem("accessToken");

        await rankingApi.post("/logout/refresh", {}, {
            headers: {
                ...getToken(true) 
            }
        });
        localStorage.removeItem("refreshToken");
    }

    async refreshToken() {
        const response = await rankingApi.post("/token/refresh", {}, {
            headers: {
                ...getToken(true)
            }
        });

        localStorage.setItem("accessToken", response.data.access_token);

        return response.data.access_token;
    }
}

export default new AuthService()
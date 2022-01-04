import rankingApi from '../../apis/ranking'

class LogService {

    async getLog(params) {
        try {
            const response = await rankingApi.get(`/logs`, {
                params
            });

            return response.data.data;
        } catch {
            return []
        }
    }
}

export default new LogService();
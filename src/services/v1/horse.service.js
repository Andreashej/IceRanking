import rankingApi from '../../apis/ranking'

class HorseService {

    async getHorses(params) {
        try {
            const response = await rankingApi.get(`/horses`, {
                params
            });

            return response.data.data;
        } catch {
            return []
        }
    }

    async getHorse(id) {
        const response = await rankingApi.get(`/horses/${id}`)

        return response.data.data
    }

    async updateHorse(id, payload) {
        try {
            const response = await rankingApi.patch(`/horses/${id}`, payload);
            return response.data;
        } catch(e) {
            return null;
        }
    }
}

export default new HorseService();
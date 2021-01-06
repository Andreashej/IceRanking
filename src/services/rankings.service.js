import rankingApi from '../apis/ranking';

class RankingListService {

    async getAllRankingLists() {
        try {
            const response = await rankingApi.get('/rankings');

            return response.data.data;
        } catch(e) {
            return null;
        }
    }

    async getRankingList(shortname) {
        try {
            const response = await rankingApi.get(`/rankings/${shortname}`);
            return response.data.data
        } catch (e) {
            return null;
        }
    }

    async updateRankingList(shortname, payload) {
        try {
            const response = await rankingApi.patch(`/rankings/${shortname}`, payload);
            return response.data;
        } catch(e) {
            return null;
        }
    }

    async importResults(shortname, file) {
        const formData = new FormData();
        formData.append("results", file);

        const response = await rankingApi.patch(`/rankings/${shortname}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.data
    }

    async importCompetitions(shortname, file) {
        const formData = new FormData();
        formData.append("competitions", file);

        const response = await rankingApi.patch(`/rankings/${shortname}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.data
    }
}

export default new RankingListService()
import rankingApi from '../../apis/ranking';

class CompetitionService {
    async getCompetitions(params) {
        try {
            const response = await rankingApi.get(`/competitions`, {
                params
            })

            return response.data.data
        } catch {
            return []
        }
    }

    async uploadResults(files) {
        const formData = new FormData();

        for (const file of files) {
            formData.append("results[]", file);
        }

        const response = await rankingApi.post(`/results`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.data
    }
}

export default new CompetitionService()
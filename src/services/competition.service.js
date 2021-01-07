import rankingApi from '../apis/ranking';

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
}

export default new CompetitionService()
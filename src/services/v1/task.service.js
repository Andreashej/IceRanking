import rankingApi from '../../apis/ranking';

class TaskService {
    async getTask(id) {
        try {
            const response = await rankingApi.get(`/tasks/${id}`)

            return response.data.data;
        } catch (e) {
            return null;
        }
    }

    async getTasks(params) {
        try {
            const response = await rankingApi.get(`/tasks`, {
                params
            });

            return response.data.data;
        } catch (e) {
            return []
        }
    }
}

export default new TaskService();
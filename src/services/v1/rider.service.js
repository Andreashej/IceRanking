import rankingApi from '../../apis/ranking';

class RiderService {
    async getRider(id) {
        const response = await rankingApi.get(`/riders/${id}`)

        return response.data.data;
    }

    async updateRider(id, rider) {
        const response = await rankingApi.patch(`/riders/${id}`, rider);

        return response.data.data
    }

    async createRider(firstname, lastname) {
        const response = await rankingApi.post(`/riders`, {
            fname: firstname,
            lname: lastname
        });

        return response.data.data;
    }

    async importAliases(file) {
        const formData = new FormData();
        formData.append("aliases", file);

        const response = await rankingApi.post('/riders', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.data
    }

    async getAliases(riderId) {
        const response = await rankingApi.get(`/riders/${riderId}/aliases`);

        return response.data.data;
    }

    async createAlias(riderId, payload) {
        try {
            const response = await rankingApi.post(`/riders/${riderId}/aliases`, payload);
            return response.data.data;
        } catch (e) {
            return Promise.reject(e.response.data.message);
        }
    }
}

export default new RiderService();
import rankingApi from '../apis/ranking';

class RiderService {
    async getRider(id) {
        const response = await rankingApi.get(`/riders/${id}`)

        return response.data.data;
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
}

export default new RiderService();
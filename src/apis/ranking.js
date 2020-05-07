import axios from 'axios';

export default axios.create({
    // baseURL: 'http://icerankingapi.eu-central-1.elasticbeanstalk.com/api'
    baseURL: 'http://localhost:5000/api',
    auth: {
        username: localStorage.getItem("token")
    }
})
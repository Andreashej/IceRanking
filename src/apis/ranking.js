import axios from 'axios';

export default axios.create({
    // baseURL: 'https://rankingapi.andreashej.dk/api',
    baseURL: 'http://localhost:5000/api',
    auth: {
        username: localStorage.getItem("token")
    }
})
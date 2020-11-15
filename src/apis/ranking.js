import axios from 'axios';

export default axios.create({
    // baseURL: 'https://rankingapi.andreashej.dk/api',
    baseURL: process.env.REACT_APP_API_URL,
    auth: {
        username: localStorage.getItem("token")
    }
})
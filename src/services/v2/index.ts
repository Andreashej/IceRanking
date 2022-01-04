import axios from 'axios';
import { handleDates } from './dates';

export const apiV2 = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/v2`,
});

apiV2.interceptors.response.use(originalResponse => {
    handleDates(originalResponse.data);
    return originalResponse;
  });
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://shared-to-do-list.onrender.com'
});

export default axiosInstance;

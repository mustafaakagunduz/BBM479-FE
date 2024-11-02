import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081', // Ensure no typo in quotes
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;

import axios from 'axios';

// Development veya production ortamı kontrolü
const isProduction = process.env.NODE_ENV === 'production';

// Production'da proxy kullan, geliştirme ortamında doğrudan API'ye bağlan
const baseURL = isProduction
    ? '/api/proxy'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081');

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
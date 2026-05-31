import axios from 'axios';

// 10.0.2.2 maps to the host machine's localhost on Android emulator.
// For a physical device, replace with your machine's LAN IP (e.g. 192.168.x.x).
const BASE_URL = 'http://10.0.2.2:3001';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error?.response?.status) {
            console.error('[API Error]', error.response.status, error.message);
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://192.168.8.145:5001'
});

export default apiClient;
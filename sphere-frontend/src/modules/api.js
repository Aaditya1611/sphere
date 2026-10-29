import axios from "axios";
import { API_URL } from "./API_URL";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
    if(error.response && (error.response.status === 403 || error.response.status === 401) && !error.config.url.includes("/login")) {
        localStorage.removeItem("userData")
        localStorage.removeItem("token")

        window.location.href = "/"
    }
    return Promise.reject(error);
})

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // Substitua com o endereço correto do seu backend
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

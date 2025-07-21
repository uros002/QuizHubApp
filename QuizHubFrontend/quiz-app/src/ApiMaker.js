import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      return {
        ...config,
        // withCredentials: true, // dodaj ovo
        headers: { ...config.headers, Authorization: `Bearer ${token}` },
      };
    }
    return {
      ...config,
      //       withCredentials: true, // i ovde da bi bilo konzistentno
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

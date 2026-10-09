import axios from "axios";

const api = axios.create({
    baseURL:"https://localhost:7168/api",
});
//Runs before every request: attach the saved token
api.interceptors.request.use((config)=>{
    const saved = JSON.parse(localStorage.getItem("auth") || "null");
    if(saved?.token){
        config.headers.Authorization = `Bearer ${saved.token}`;
    }
    return config;
})
//Runs after every response: if the token is rejected, go back to login
api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        const isLoginCall = error.config?.url?.includes("/auth/login");
        if(error.response?.status ===401 &&!isLoginCall){
            localStorage.removeItem("auth");
            window.location.href ="/login";
        }
        return Promise.reject(error);
    }
);

export default api;
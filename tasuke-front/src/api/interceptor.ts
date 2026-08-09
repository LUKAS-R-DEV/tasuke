import {api} from "@/api/client.ts";
import {getToken} from "@/api/token";

api.interceptors.request.use(
    (config)=>{
        const token = getToken();
        if(token){
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)
import {api} from "@/lib/Axios.ts";
import type {ApiResponse} from "@/types/api.ts";
import type {LoginRequest, LoginResponse, UserResponse} from "@/types/auth.ts";


class authService{
async login(request: LoginRequest){
    const response =  await api.post<ApiResponse<LoginResponse>>("/auth/login", request);
    return response.data;
}

async me(): Promise<UserResponse> {
    const response = await api.get<ApiResponse<UserResponse>>("/auth/me");
    return response.data.data;
}

}
export default new authService();

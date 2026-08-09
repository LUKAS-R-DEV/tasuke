import {api} from "@/lib/Axios.ts";
import type {ApiResponse} from "@/types/api.ts";
import type {CreateUserRequest, ManagedUser} from "@/types/user.ts";

class UserService {
    async getAll(): Promise<ManagedUser[]> {
        const response = await api.get<ApiResponse<ManagedUser[]>>("/users");
        return response.data.data;
    }

    async create(request: CreateUserRequest): Promise<ManagedUser> {
        const response = await api.post<ApiResponse<ManagedUser>>("/users", request);
        return response.data.data;
    }

    async update(id: number, request: CreateUserRequest): Promise<ManagedUser> {
        const response = await api.patch<ApiResponse<ManagedUser>>(`/users/update/${id}`, request);
        return response.data.data;
    }

    async deactivate(id: number): Promise<ManagedUser> {
        const response = await api.patch<ApiResponse<ManagedUser>>(`/users/deactivate/${id}`);
        return response.data.data;
    }

    async activate(id: number): Promise<ManagedUser> {
        const response = await api.patch<ApiResponse<ManagedUser>>(`/users/activate/${id}`);
        return response.data.data;
    }
}

export default new UserService();

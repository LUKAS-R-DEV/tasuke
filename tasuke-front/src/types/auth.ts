export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

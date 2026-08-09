import { createContext } from "react";

export interface User{
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface AuthContextType{
    user: User | null;
    token: string | null;
    authenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
export const AuthContextType = createContext<AuthContextType | null>(null)
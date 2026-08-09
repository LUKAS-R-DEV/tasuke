import {useMemo,useState,type ReactNode} from "react";
import {AuthContextType, type User} from "@/context/AuthContext";
import authService from "@/services/auth.service";

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({children}: AuthProviderProps) {

    const [user,setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) as User : null;
    });
    const [token,setToken] = useState<string | null>(() => localStorage.getItem("token"));

    async function login(email:string,password:string){
        const response = await authService.login({email, password});
        const newToken = response.data.token;

        // Persiste o token antes de buscar o usuário para que o interceptor
        // do Axios anexe o Authorization no /auth/me.
        localStorage.setItem("token", newToken);
        setToken(newToken);

        const userResponse = await authService.me();
        const newUser: User = {
            id: userResponse.id,
            name: userResponse.name,
            email: userResponse.email,
            role: userResponse.role,
            createdAt: userResponse.createdAt,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    }

    async function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    const value = useMemo(() => ({
        user,
        token,
        authenticated: !!token,
        login,
        logout
    }), [user, token]);

    return (
        <AuthContextType.Provider value={value}>
            {children}
        </AuthContextType.Provider>
    );
}

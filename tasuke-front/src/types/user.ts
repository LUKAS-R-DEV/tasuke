export type UserRole = "ROLE_ADMIN" | "ROLE_AGENT" | "ROLE_CUSTOMER";

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

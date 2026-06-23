import { api } from "./api";
import type { RegisterFormValues } from "@/schemas/auth.schema";
import type { UserRole } from "@/types";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
}

export const authService = {
  async login(email: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const { data } = await api.post<TokenResponse>("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },

  async register(payload: RegisterFormValues): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);
    return data;
  },
};

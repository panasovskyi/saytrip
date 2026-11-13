import { User } from "@/features/auth/auth.types";
import { LoginPayload } from "@/features/auth/schemas/login.schema";
import { RegistrationPayload } from "@/features/auth/schemas/registration.schema";
import { api } from "@/lib/api";

export const authApi = {
  async register(payload: RegistrationPayload): Promise<User> {
    const res = await api.post<User>("/auth/register", payload);

    return res;
  },

  async login(payload: LoginPayload): Promise<User> {
    const res = await api.post<User>("/auth/login", payload);

    return res;
  },

  async getMyProfile(cookie: string): Promise<User> {
    const res = await api.get<User>("/auth/me", {headers: { cookie }});

    return res;
  },

  async logout(): Promise<void> {
    await api.post<void>("/auth/logout");
  }
};

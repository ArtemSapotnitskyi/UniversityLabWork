import { apiClient } from "../api/apiClient";
import { useAuthStore } from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";

export interface AuthResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<void> {
  const response = await apiClient.post<AuthResponse>("/api/account/login", {
    email,
    password,
  });

  const token = response.data.token;
  const decoded: any = jwtDecode(token);

  const role =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    "User";

  useAuthStore.getState().setAuth(token, { email, role });
}

export async function register(
  userName: string,
  email: string,
  password: string,
): Promise<void> {
  await apiClient.post("/api/account/register", {
    userName,
    email,
    password,
  });
}

export async function confirmEmail(
  userId: string,
  token: string,
): Promise<void> {
  await apiClient.get(
    `/api/account/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`,
  );
}

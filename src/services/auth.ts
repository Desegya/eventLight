import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordChangeData,
  PasswordResetData,
  PasswordResetConfirmData,
  ProfileUpdateData,
} from "../types/auth";
import { ensureCsrfCookie, csrfHeader } from "./csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

class AuthError extends Error {
  constructor(public status: number, message: string, public errors?: any) {
    super(message);
    this.name = "AuthError";
  }
}

class AuthService {
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    await ensureCsrfCookie();
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...csrfHeader(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AuthError(
          response.status,
          errorData.detail || `HTTP error! status: ${response.status}`,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(0, "Network error or server unavailable");
    }
  }

  // Authentication endpoints. The auth token itself lives in an httpOnly
  // cookie set by the backend — this service never sees or stores the raw
  // token, so there's nothing for page JavaScript (or an XSS payload) to read.
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout/", {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request("/auth/user/");
  }

  async updateProfile(profileData: ProfileUpdateData): Promise<User> {
    return this.request("/auth/user/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: PasswordChangeData): Promise<any> {
    return this.request("/auth/password/change/", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  }

  async resetPassword(resetData: PasswordResetData): Promise<any> {
    return this.request("/auth/password/reset/", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  }

  async confirmPasswordReset(
    confirmData: PasswordResetConfirmData
  ): Promise<any> {
    return this.request("/auth/password/reset/confirm/", {
      method: "POST",
      body: JSON.stringify(confirmData),
    });
  }
}

export const authService = new AuthService();
export { AuthError };

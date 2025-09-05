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

const API_BASE_URL = "http://localhost:8000/api";

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
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
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

  // Token management
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  setToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  removeToken(): void {
    localStorage.removeItem("authToken");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Authentication endpoints
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.key) {
      this.setToken(response.key);
    }

    return response;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.key) {
      this.setToken(response.key);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout/", {
        method: "POST",
      });
    } finally {
      this.removeToken();
    }
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

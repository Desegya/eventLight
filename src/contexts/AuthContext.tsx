import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  LoginCredentials,
  RegisterData,
  ProfileUpdateData,
} from "../types/auth";
import { authService, AuthError } from "../services/auth";
import { useToast } from "@chakra-ui/react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const isAuthenticated = authService.isAuthenticated() && !!user;

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Token might be invalid, remove it
          authService.removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      await authService.login(credentials);

      // Get user data after login
      const userData = await authService.getCurrentUser();
      setUser(userData);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof AuthError
          ? error.message
          : "Login failed. Please try again.";

      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      await authService.register(userData);

      // Get user data after registration
      const userDataResponse = await authService.getCurrentUser();
      setUser(userDataResponse);

      toast({
        title: "Account Created!",
        description: "Your account has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error instanceof AuthError && error.errors) {
        // Handle field-specific errors
        const errors = Object.values(error.errors).flat();
        errorMessage = errors.join(", ");
      } else if (error instanceof AuthError) {
        errorMessage = error.message;
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
        authService.removeToken();
      }
    }
  };

  const updateProfile = async (
    profileData: ProfileUpdateData
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      let errorMessage = "Profile update failed. Please try again.";

      if (error instanceof AuthError && error.errors) {
        // Handle field-specific errors
        const errors = Object.values(error.errors).flat();
        errorMessage = errors.join(", ");
      } else if (error instanceof AuthError) {
        errorMessage = error.message;
      }

      toast({
        title: "Update Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

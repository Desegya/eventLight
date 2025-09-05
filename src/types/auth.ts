export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  preferred_categories: string[];
  preferred_languages: string[];
  preferred_age_groups: string[];
  max_distance_km: number | null;
  email_notifications: boolean;
  event_reminders: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  preferred_categories?: string[];
  preferred_languages?: string[];
  preferred_age_groups?: string[];
  max_distance_km?: number | null;
  email_notifications?: boolean;
  event_reminders?: boolean;
}

export interface AuthResponse {
  key: string;
  user?: User;
}

export interface PasswordChangeData {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
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
  date_joined: string;
  events_created_count: number;
  events_liked_count: number;
  events_saved_count: number;
  events_attending_count: number;
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
  username?: string;
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
  expiry: string;
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
  token: string;
  new_password1: string;
  new_password2: string;
}

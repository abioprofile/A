import apiClient from './config';
import { AuthResponse, SignUpRequest, SignInRequest, SignInResponse, UpdateProfileRequest, UpdateProfileResponse, AddLinksRequest, ProfileLink } from '@/types/auth.types';

// Sign up API
export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/user/signup', data);
  return response.data;
};

// Sign in API
// Note: Login response doesn't include profile, so we call /user endpoint after login
export const signIn = async (data: SignInRequest): Promise<SignInResponse & { headers?: any }> => {
  const response = await apiClient.post<SignInResponse>('/auth/login', data);
  return {
    ...response.data,
    // Include headers in case token is in Authorization header or Set-Cookie
    headers: response.headers,
  };
};

// Get current user (includes full profile)
// This should be called after login to get the complete user data
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await apiClient.get<AuthResponse>('/user');
  return response.data;
};

// Verify email API (if needed)
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/verify-email', {
    token,
  });
  return response.data;
};

// Forgot password API
export const forgotPassword = async (email: string): Promise<{ status: string; message: string }> => {
  const response = await apiClient.post<{ status: string; message: string }>('/auth/forgot-password', { email });
  return response.data;
};

// Reset password API
export const resetPassword = async (
  token: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/auth/reset-password', {
    token,
    password,
  });
  return response.data;
};

// Resend OTP API
export const resendOtp = async (email: string): Promise<{ success: boolean; message: string; }> => {
  const response = await apiClient.post('/auth/resend-verification-email', { email });
  return response.data;
};

// Check for username availability
export const usernameAvailability = async (username: string): Promise<{
  success: boolean;
  message: string;
  data: {
    username: string;
    isAvailable: boolean;
    isValid: boolean;
  };
  statusCode: number;
}> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: {
      username: string;
      isAvailable: boolean;
      isValid: boolean;
    };
    statusCode: number;
  }>(`/user/check-username?username=${username}`);
  return response.data;
};

// Update profile API
export const updateProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse & { headers?: Record<string, string> }> => {
  const response = await apiClient.patch<UpdateProfileResponse>('/user/profile', data);
  return {
    ...response.data,
    headers: response.headers as Record<string, string>,
  };
}; 

export const addLinks = async (data: AddLinksRequest): Promise<{
  success: boolean;
  message: string;
  data: {
    link: ProfileLink;
  };
  statusCode: number;
} & { headers?: Record<string, string> }> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: {
      link: ProfileLink;
    };
    statusCode: number;
  }>(`/links`, data);
  return {
    ...response.data,
    headers: response.headers as Record<string, string>,
  };
};
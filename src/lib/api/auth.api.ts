import apiClient from './config';
import { AuthResponse, SignUpRequest, SignInRequest, SignInResponse } from '@/types/auth.types';

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
export const resendOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/auth/resend-verification-email', { email });
  return response.data;
};


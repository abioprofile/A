import apiClient from "./config";
import {
  AuthResponse,
  SignUpRequest,
  SignInRequest,
  SignInResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  AddLinksRequest,
  ProfileLink,
  AllLinksResponse,
  UserProfile,
  VerifyOtpResponse,
  WaitlistRequest,
  DisplayConfig,
  } from "@/types/auth.types";
import { AppearanceResponse, CornerConfig, FillGradientWallpaperConfig, FontConfig, ImageWallpaperConfig, WallpaperConfig } from "@/types/appearance.types";

// Sign up API
export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/user/signup", data);
  return response.data;
};

// Sign in API
// Note: Login response doesn't include profile, so we call /user endpoint after login
export const signIn = async (
  data: SignInRequest
): Promise<SignInResponse & { headers?: any }> => {
  const response = await apiClient.post<SignInResponse>("/auth/login", data);
  return {
    ...response.data,
    // Include headers in case token is in Authorization header or Set-Cookie
    headers: response.headers,
  };
};

// Get current user (includes full profile)
// This should be called after login to get the complete user data
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await apiClient.get<AuthResponse>("/user");
  return response.data;
};

// Verify email API (if needed)
export const verifyEmail = async (token: string): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>("/auth/verify-email", {
    token,
  });
  return response.data;
};

// Forgot password API
export const forgotPassword = async (
  email: string
): Promise<{ status: string; message: string }> => {
  const response = await apiClient.post<{ status: string; message: string }>(
    "/auth/forgot-password",
    { email }
  );
  return response.data;
};

// Reset password API
export const resetPassword = async (
  token: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};

// Resend OTP API
export const resendOtp = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post("/auth/resend-verification-email", {
    email,
  });
  return response.data;
};

// Check for username availability
export const usernameAvailability = async (
  username: string
): Promise<{
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
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse & { headers?: Record<string, string> }> => {
  const response = await apiClient.patch<UpdateProfileResponse>(
    "/user/profile",
    data
  );
  return {
    ...response.data,
    headers: response.headers as Record<string, string>,
  };
};

export const addLinks = async (
  data: AddLinksRequest
): Promise<
  {
    success: boolean;
    message: string;
    data: {
      link: ProfileLink;
    };
    statusCode: number;
  } & { headers?: Record<string, string> }
> => {
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

export const getAllLinks = async (): Promise<
  AllLinksResponse & { headers?: any }
> => {
  const response = await apiClient.get<AllLinksResponse>("/links");
  return {
    ...response.data,
    headers: response.headers,
  };
};

// Get user profile by username (public endpoint)
export const getUserProfileByUsername = async (
  username: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    username: string;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    isPublic: boolean;
    links: ProfileLink[];
    user: {
      name: string;
    };
    display: DisplayConfig;
  };
  statusCode: number;
}> => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: {
      id: string;
      userId: string;
      username: string;
      bio: string | null;
      location: string | null;
      avatarUrl: string | null;
      isPublic: boolean;
      links: ProfileLink[];
      user: {
        name: string;
      };
      display: DisplayConfig;
    };
    statusCode: number;
  }>(`/user/${username}`);
  return response.data;
};

// update profile avatar in form data 
export const updateProfileAvatar = async (
  avatarFile: File
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  // The interceptor will handle removing Content-Type for FormData
  // so the browser can set it with the correct boundary
  const response = await apiClient.patch<UpdateProfileResponse>(
    "/user/profile/avatar",
    formData
  );
  return response.data;
};

// update a link
export const updateLink = async (
  linkId: string,
  data: {
    title?: string;
    url?: string;
    isVisible?: boolean;
  }
): Promise<{
  success: boolean;
  message: string;
  data: ProfileLink;
  statusCode: number;
}> => {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: ProfileLink;
    statusCode: number;
  }>(`/links/${linkId}`, data);
  return response.data;
};

// update link with icon in form data
export const updateLinkWithIcon = async (
  linkId: string,
  iconFile: File
): Promise<{
  success: boolean;
  message: string;
  data: ProfileLink;
  statusCode: number;
}> => {
  const formData = new FormData();
  formData.append('icon', iconFile);
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: ProfileLink;
    statusCode: number;
  }>(`/links/${linkId}/icon`, formData);
  return response.data;
};

// reorder all links
export const reorderLinks = async (
  data: {
    links: Array<{
      id: string;
      displayOrder: number;
    }>;
  }
): Promise<{
  success: boolean;
  message: string;
  data: ProfileLink | null;
  statusCode: number;
}> => {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: ProfileLink | null;
    statusCode: number;
  }>(`/links/reorder/all`, data);
  return response.data;
};

// delete a link
export const deleteLink = async (
  linkId: string
): Promise<{
  success: boolean;
  message: string;
  data: ProfileLink | null;
  statusCode: number;
}> => {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
    data: ProfileLink | null;
    statusCode: number;
  }>(`/links/${linkId}`);
  return response.data;
};

export const createWaitlist = async (data: {email: string, name: string}): Promise<{
  success: boolean;
  message: string;
  data: {
    id: string,
    email: string,
    createdAt: string,
    updatedAt: string,
    name: string
  };
  statusCode: number;
}> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: {
      id: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      name: string
    };
    statusCode: number;
  }>('/waitlist', data);
  return response.data
}

export const getWaitlist = async () : Promise<WaitlistRequest> => {
  const response = await apiClient.get<WaitlistRequest>('/waitlist/jzI27AUJTCKU');
  return response.data
}

export const getSettings = async () : Promise<AppearanceResponse> => {
  const response = await apiClient.get<AppearanceResponse>('/user/preferences');
  return response.data
}

export const updateAppearanceCorners = async (
  data: CornerConfig,
  signal?: AbortSignal
): Promise<AppearanceResponse> => {
  const response = await apiClient.put<AppearanceResponse>(
    "/user/preferences/corners",
    data,
    { signal }
  );
  return response.data;
};

export const updateAppearanceFont = async (
  data: FontConfig,
  signal?: AbortSignal
): Promise<AppearanceResponse> => {
  const response = await apiClient.put<AppearanceResponse>(
    "/user/preferences/fonts",
    data,
    { signal }
  );
  return response.data;
};

export const updateAppearanceWallpaper = async (
  data: FillGradientWallpaperConfig,
  signal?: AbortSignal
) : Promise<AppearanceResponse> => {
  const response = await apiClient.put<AppearanceResponse>('/user/preferences/background', data, { signal });
  return response.data
}

export const updateAppearanceImage = async (
  data: ImageWallpaperConfig,
    signal?: AbortSignal
) : Promise<AppearanceResponse> => {
  const formData = new FormData();
  formData.append('image', data.image);
  const response = await apiClient.put<AppearanceResponse>('/user/preferences/background', formData, { signal });
  return response.data
}
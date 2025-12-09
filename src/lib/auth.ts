import { getFetch, patchFetch, postFetch, putFetch, deleteFetch } from "@/lib/fetcher";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string
) => {
  return await postFetch("/user/signup", {
    name,
    email,
    password,
    passwordConfirm,
  });
};

export const login = async (email: string, password: string) => {
  return await postFetch("/auth/login", {
    email,
    password,
  });
};

export const verifyOtp = async (token: string) => {
  return await postFetch("/auth/verify-email", { token });
};

export const resendOtp = async (email: string) => {
  return await postFetch("/auth/resend-verification-email", { email });
};

export const checkUsername = async (username: string, headers: Record<string, string> = {}) => {
  return await getFetch(`/user/check-username?username=${username}`, headers);
};


export const getUserProfile = async (username: string, headers: Record<string, string> = {}) => {
  return await getFetch(`/user/${username}`, headers);
};

export const updateUser = async (
  data: {
    username?: string;
    displayName?: string;
    bio?: string;
    location?: string;
    goals?: string[];
  },
  headers: Record<string, string> = {}
) => {
  return await patchFetch(`/user/profile`, data, headers);
};

export const addLink = async (
  data: {
    title: string;
    url: string;
    platform?: string;
  },
  headers: Record<string, string> = {}
) => {
  return await postFetch(`/links`, data, headers);
};

export const getLinks = async (headers: Record<string, string> = {}) => {
  return await getFetch(`/links`, headers);
};

export const getLink = async (linkId: string, headers: Record<string, string> = {}) => {
  return await getFetch(`/links/${linkId}`, headers);
};

export const updateLink = async (
  linkId: string,
  data: {
    title?: string;
    url?: string;
    platform?: string;
  },
  headers: Record<string, string> = {}
) => {
  return await patchFetch(`/links/${linkId}`, data, headers);
};

export const deleteLink = async (linkId: string, headers: Record<string, string> = {}) => {
  return await deleteFetch(`/links/${linkId}`, headers);
};
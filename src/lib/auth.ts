import { postData, getData } from "./api";

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<RegisterResponse> {
  return postData<RegisterResponse>("/user/signup", {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
  });
}

export async function loginUser(email: string, password: string) {
  const data = await postData<{ token: string; user: any }>("/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", data.token);
  return data;
}

export async function getUserProfile() {
  return getData("/user/profile");
}


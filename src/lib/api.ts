import axios, { AxiosError } from "axios";

const getBaseURL = (): string => {
  // if (typeof window !== "undefined") {
    // const hostname = window.location.hostname;
    return process.env.NEXT_PUBLIC_API_URL!;
  // }
  // console.log(process.env.NEXT_PUBLIC_DEV_API_URL);
  // return process.env.NEXT_PUBLIC_DEV_API_URL!;
};

export const apiInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiInstance.interceptors.request.use(
  (config) => {
    // Ensure credentials are always sent
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Store the current path to redirect back after login
        const currentPath = window.location.pathname;
        if (currentPath !== "/" && currentPath !== "/auth/login") {
          sessionStorage.setItem("redirectAfterLogin", currentPath);
        }
        
        // Redirect to login page - adjust this path to match your login route
        // window.location.href = "/";
      }
    }
    
    return Promise.reject(error);
  }
);



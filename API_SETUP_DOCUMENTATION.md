# API Integration Setup Documentation

This document contains all the API integration setup, authentication flow, and related configurations built for the A.Bio project.

## 📦 Dependencies Installed

```json
{
  "@tanstack/react-query": "^5.90.12",
  "@tanstack/react-query-devtools": "^5.91.1",
  "@reduxjs/toolkit": "^2.11.1",
  "react-redux": "^9.2.0",
  "react-hook-form": "^7.68.0",
  "zod": "^4.1.13",
  "@hookform/resolvers": "^5.2.2",
  "axios": "^1.13.2"
}
```

## 🏗️ Architecture Overview

- **React Query**: For data fetching and caching
- **Redux Toolkit**: For persisting authentication state
- **React Hook Form + Zod**: For form validation
- **Axios**: HTTP client with interceptors

## 📁 File Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── config.ts          # Axios configuration
│   │   └── auth.api.ts        # Auth API functions
│   └── validations/
│       └── auth.schema.ts     # Zod schemas
├── stores/
│   ├── slices/
│   │   └── auth.slice.ts      # Redux auth slice
│   ├── store.ts               # Redux store
│   └── hooks.ts               # Typed Redux hooks
├── hooks/
│   └── api/
│       └── useAuth.ts         # React Query auth hooks
├── providers/
│   ├── QueryProvider.tsx      # React Query provider
│   └── ReduxProvider.tsx      # Redux provider
└── types/
    └── auth.types.ts          # TypeScript types
```

## 🔧 Configuration Files

### 1. API Configuration (`src/lib/api/config.ts`)

```typescript
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or Redux store
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Environment Variables (`.env`)

```env
NEXT_PUBLIC_API_BASE_URL=https://abio-site-backend.onrender.com/api/v1
```

**Important**: 
- Must restart dev server after changing `.env` file
- Variable name must start with `NEXT_PUBLIC_` to be accessible in the browser

## 📝 Type Definitions

### Types (`src/types/auth.types.ts`)

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  goals: string[];
  avatarUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  statusCode: number;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data: UserWithoutProfile;
  statusCode: number;
  token?: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

## 🔐 Authentication API

### Auth API Functions (`src/lib/api/auth.api.ts`)

```typescript
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
    headers: response.headers,
  };
};

// Get current user (includes full profile)
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await apiClient.get<AuthResponse>('/user');
  return response.data;
};

// Verify email API
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/verify-email', { token });
  return response.data;
};

// Forgot password API
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password API
export const resetPassword = async (
  token: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/auth/reset-password', { token, password });
  return response.data;
};
```

## 🎣 React Query Hooks

### Auth Hooks (`src/hooks/api/useAuth.ts`)

```typescript
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUp, signIn, getCurrentUser } from '@/lib/api/auth.api';
import { SignUpRequest, SignInRequest, AuthResponse, SignInResponse, User } from '@/types/auth.types';
import { useAppDispatch } from '@/stores/hooks';
import { setAuth, updateUser } from '@/stores/slices/auth.slice';

// Sign up mutation
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
    onSuccess: (response: AuthResponse) => {
      if (response.data) {
        dispatch(setAuth({ user: response.data, token: null }));
      }
      
      if (typeof window !== 'undefined' && response.data) {
        localStorage.setItem('user_data', JSON.stringify(response.data));
      }

      queryClient.setQueryData(['user'], response.data);
      
      toast.success('Account created successfully', {
        description: response.message || 'Please check your email to verify your account',
      });
      
      router.push('/auth/verification?prev=register');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create account. Please try again.';
      toast.error('Sign up failed', {
        description: errorMessage,
      });
    },
  });
};

// Sign in mutation
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: SignInRequest) => {
      // Step 1: Call login endpoint
      const loginResponse = await signIn(data);
      
      // Step 2: Extract token from login response
      let token = (loginResponse as any).token || (loginResponse as any).data?.token;
      
      // Check if token is in Authorization header
      if (!token && loginResponse.headers) {
        const authHeader = loginResponse.headers['authorization'] || loginResponse.headers['Authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
      
      // Step 3: Store token immediately so the next request is authenticated
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
      
      // Step 4: Fetch complete user data with profile from /user endpoint
      try {
        const userResponse = await getCurrentUser();
        return {
          ...userResponse,
          token: token || (userResponse as any).token,
        } as AuthResponse & { token?: string };
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
      }
    },
    onSuccess: (response: AuthResponse & { token?: string }) => {
      const token = response.token;
      
      if (response.data) {
        dispatch(setAuth({ user: response.data, token: token || null }));
      }

      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('auth_token', token);
        }
        if (response.data) {
          localStorage.setItem('user_data', JSON.stringify(response.data));
        }
      }

      queryClient.setQueryData(['user'], response.data);
      
      toast.success('Login successful', {
        description: response.message || 'Welcome back!',
      });
      
      router.push('/dashboard');
    },
    onError: (error: any) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to sign in. Please check your credentials.';
      toast.error('Sign in failed', {
        description: errorMessage,
      });
    },
  });
};

// Hook to fetch current user (useful for refreshing user data)
export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (user: User) => {
      dispatch(updateUser(user));
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    },
  });
};
```

## 📋 Form Validation Schemas

### Zod Schemas (`src/lib/validations/auth.schema.ts`)

```typescript
import { z } from 'zod';

// Sign up schema
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Sign in schema
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
```

## 🗄️ Redux Store Setup

### Store Configuration (`src/stores/store.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice (`src/stores/slices/auth.slice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@/types/auth.types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load initial state from localStorage if available
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('user_data');
  
  if (storedToken) {
    initialState.token = storedToken;
  }
  
  if (storedUser) {
    try {
      initialState.user = JSON.parse(storedUser);
      initialState.isAuthenticated = true;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
    }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; token: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
```

### Typed Hooks (`src/stores/hooks.ts`)

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 🎯 Providers Setup

### Query Provider (`src/providers/QueryProvider.tsx`)

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### Redux Provider (`src/providers/ReduxProvider.tsx`)

```typescript
'use client';

import { Provider } from 'react-redux';
import { store } from '@/stores/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

### Root Layout Integration (`src/app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Inter } from 'next/font/google'
import { QueryProvider } from "@/providers/QueryProvider"
import { ReduxProvider } from "@/providers/ReduxProvider"

export const metadata: Metadata = {
  title: "A official website",
  description: "A",
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`max-[320px]:text-sm antialiased`}>
        <ReduxProvider>
          <QueryProvider>
            {children}
            <Toaster theme="light" richColors />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
```

## 📄 Form Implementation Examples

### Sign Up Page (`src/app/auth/sign-up/page.tsx`)

Key parts:
- Uses `useForm` from react-hook-form
- Uses `zodResolver` with `signUpSchema`
- Calls `useSignUp()` hook
- Shows validation errors inline
- Handles loading states

```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<SignUpFormData>({
  resolver: zodResolver(signUpSchema),
});

const signUpMutation = useSignUp();

const onSubmit = async (data: SignUpFormData) => {
  const { confirm_password, ...signUpData } = data;
  signUpMutation.mutate(signUpData);
};
```

### Sign In Page (`src/app/auth/sign-in/page.tsx`)

Similar structure to sign-up but uses:
- `signInSchema` for validation
- `useSignIn()` hook

## 🔄 Authentication Flow

### Sign Up Flow
1. User submits form → Validation (Zod)
2. `useSignUp` mutation → POST `/user/signup`
3. On success → Store in Redux + localStorage
4. Redirect to verification page

### Sign In Flow
1. User submits form → Validation (Zod)
2. `useSignIn` mutation → POST `/auth/login` (get token)
3. Extract token → Store in localStorage
4. GET `/user` → Get complete user data with profile
5. Store in Redux + localStorage
6. Redirect to dashboard

## 🔑 Key Features

1. **Automatic Token Injection**: Axios interceptor adds Bearer token to all requests
2. **Error Handling**: Centralized error handling with toast notifications
3. **State Persistence**: Redux + localStorage for auth state
4. **Type Safety**: Full TypeScript support
5. **Form Validation**: Zod schemas with React Hook Form
6. **Loading States**: Built-in loading states for mutations
7. **Auto Redirect**: Automatic redirects after auth actions

## 🚀 Usage Examples

### Using Auth Hooks in Components

```typescript
import { useSignIn, useSignUp } from '@/hooks/api/useAuth';
import { useAppSelector } from '@/stores/hooks';

// In component
const signInMutation = useSignIn();
const { user, isAuthenticated } = useAppSelector((state) => state.auth);

// Call mutation
signInMutation.mutate({ email: 'user@example.com', password: 'password123' });
```

### Accessing User Data

```typescript
import { useAppSelector } from '@/stores/hooks';

const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

// Access user profile
const username = user?.profile?.username;
const avatarUrl = user?.profile?.avatarUrl;
```

## 📌 Important Notes

1. **Environment Variables**: Must restart dev server after changing `.env`
2. **Token Storage**: Token stored in `localStorage` as `auth_token`
3. **User Data**: User data stored in `localStorage` as `user_data`
4. **API Endpoints**: 
   - Sign up: `/user/signup`
   - Sign in: `/auth/login`
   - Get user: `/user`
5. **Login Flow**: Login doesn't return profile, so we call `/user` endpoint after login
6. **CORS**: Backend must have CORS configured for the frontend domain

## 🐛 Troubleshooting

1. **404 Errors**: Check `NEXT_PUBLIC_API_BASE_URL` in `.env` file
2. **CORS Errors**: Ensure backend has CORS configured
3. **Token Not Found**: Check if token is being returned in login response
4. **Profile Missing**: Login calls `/user` endpoint to get profile

## 📚 Next Steps

1. Add refresh token logic
2. Add token expiration handling
3. Add protected route wrapper
4. Add logout functionality
5. Add password reset flow
6. Add email verification flow


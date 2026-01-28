import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  signUp,
  signIn,
  getCurrentUser,
  verifyEmail,
  resendOtp,
  forgotPassword,
  usernameAvailability,
  updateProfile as updateProfileApi,
  addLinks,
  getAllLinks,
  getUserProfileByUsername,
  updateProfileAvatar,
  updateLink,
  updateLinkWithIcon,
  reorderLinks,
  deleteLink,
} from "@/lib/api/auth.api";
import {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  User,
  UpdateProfileRequest,
  UpdateProfileResponse,
  AddLinksRequest,
  ProfileLink,
  VerifyOtpResponse,
  UserProfile,
} from "@/types/auth.types";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setAuth, updateUser } from "@/stores/slices/auth.slice";
import {
  ResendOtpFormData,
  VerifyOtpFormData,
  ForgotPasswordFormData,
} from "@/lib/validations/auth.schema";

// Sign up mutation
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
    onSuccess: (response: AuthResponse) => {
      // Store user data in Redux
      // if (response.data) {
      //   dispatch(setAuth({ user: response.data, token: null })); // Token might come from sign-in
      // }

      // Store in localStorage if needed
      // if (typeof window !== "undefined" && response.data) {
      //   localStorage.setItem("user_data", JSON.stringify(response.data));
      // }

      // queryClient.setQueryData(["user"], response.data);

      toast.success("Account created successfully", {
        description:
          response.message || "Please check your email to verify your account",
      });

      router.push(
        `/auth/verification?prev=register&email=${encodeURIComponent(
          response.data.email
        )}`
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create account. Please try again.";
      toast.error("Sign up failed", {
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
  const currentUser = useAppSelector((state) => state.auth.user);

  console.log(currentUser?.isOnboardingCompleted, "completed?");

  return useMutation({
    mutationFn: async (data: SignInRequest) => {
      // Step 1: Call login endpoint
      const loginResponse = await signIn(data);

      // Step 2: Extract token from login response
      // Based on your API: token is in data.token, user is in data.user
      const responseData = loginResponse.data || (loginResponse as any);
      let token = responseData?.token;

      // Check if token is in Authorization header
      if (!token && loginResponse.headers) {
        const authHeader =
          loginResponse.headers["authorization"] ||
          loginResponse.headers["Authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }

      // Step 3: Store token immediately so the next request is authenticated
      if (token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }

      // Step 4: Fetch complete user data with profile from /user endpoint
      try {
        const userResponse = await getCurrentUser();
        return {
          ...userResponse,
          // Preserve token
          token: token || (userResponse as any).token,
        } as AuthResponse & { token?: string };
      } catch (error) {
        // If /user endpoint fails, try to use login response data
        // But login response doesn't have profile, so we still need /user
        console.error("Failed to fetch user data:", error);
        throw error; // Re-throw to trigger onError handler
      }
    },
    onSuccess: (response: AuthResponse & { token?: string }) => {
      const token = response.token;

      // Store auth data in Redux
      if (response.data) {
        dispatch(setAuth({ user: response.data, token: token || null }));
      }

      // Store in localStorage
      if (typeof window !== "undefined") {
        if (token) {
          localStorage.setItem("auth_token", token);
        }
        if (response.data) {
          localStorage.setItem("user_data", JSON.stringify(response.data));
        }
      }

      queryClient.setQueryData(["user"], response.data);

      toast.success("Login successful", {
        description: response.message || "Welcome back!",
      });

      if (currentUser?.isOnboardingCompleted === true) {
        router.push("/dashboard");
      } else {
        router.push("/auth/username");
      }
    },
    onError: (error: any) => {
      // Clear any stored token on error
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sign in. Please check your credentials.";
      toast.error("Sign in failed", {
        description: errorMessage,
      });
    },
  });
};

export const useVerifyOtp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (data: VerifyOtpFormData) => {
      return await verifyEmail(data.token);
    },
    onSuccess: (response: VerifyOtpResponse) => {
      if (response.data) {
        dispatch(
          setAuth({ user: response.data.user, token: response.data.token })
        );
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));
        router.push("/auth/username");
        toast.success("Email verified successfully", {
          description:
            response.message || "Please set your username to continue",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to verify OTP", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to verify OTP. Please try again.",
      });
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (data: ResendOtpFormData) => {
      return await resendOtp(data.email);
    },
    onSuccess: (response: { success: boolean; message: string }) => {
      toast.success("OTP resent successfully", {
        description:
          response.message || "Please check your email to verify your account",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error("Failed to resend OTP", {
        description: errorMessage,
      });
    },
  });
};

export const useForgotPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      return await forgotPassword(data.email);
    },
    onSuccess: (
      response: { status: string; message: string },
      variables: ForgotPasswordFormData
    ) => {
      if (response.status === "success") {
        toast.success("OTP code sent to email", {
          description:
            response.message || "Please check your email for OTP code",
        });
        router.push(
          `/auth/verification?prev=forgot-password&email=${encodeURIComponent(
            variables.email
          )}`
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP. Please try again.";
      toast.error("Failed to send OTP", {
        description: errorMessage,
      });
    },
  });
};

export const useCheckUsername = (
  username: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["username", username],
    queryFn: async () => {
      return await usernameAvailability(username);
    },
    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : !!username && username.trim().length > 0,
    // Prevent refetching if query is disabled
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      return await updateProfileApi(data);
    },
    onSuccess: (response: UpdateProfileResponse) => {
      // Update Redux store with new profile data
      // The response.data is ProfileWithLinks, we need to merge it into the user's profile
      if (currentUser) {
        // Merge the updated profile into the existing user
        const updatedUser: User = {
          ...currentUser,
          profile: {
            ...currentUser.profile,
            // Merge all profile fields from response (includes links)
            ...response.data,
          },
        };

        // Update Redux store
        dispatch(updateUser(updatedUser));

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(updatedUser));
        }
      }

      // Update React Query cache
      queryClient.setQueryData(["user"], (oldData: User | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            profile: {
              ...oldData.profile,
              ...response.data, // Merge updated profile data (includes links)
            },
          };
        }
        return oldData;
      });

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success("Profile updated successfully", {
        description: response.message || "Your profile has been updated",
      });

      router.push("/auth/platforms");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile. Please try again.";
      toast.error("Failed to update profile", {
        description: errorMessage,
      });
    },
  });
};

export const useAddLinks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddLinksRequest) => {
      return await addLinks(data);
    },
    onSuccess: (response: {
      success: boolean;
      message: string;
      data: { link: ProfileLink };
    }) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Links added successfully", {
        description: response.message || "Your links have been added",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add links. Please try again.";
      toast.error("Failed to add links", {
        description: errorMessage,
      });
    },
  });
};

export const useGetAllLinks = () => {
  return useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      return await getAllLinks();
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("auth_token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch current user (useful for refreshing user data)
export const useCurrentUser = () => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getCurrentUser();
      const user = response.data;

      // Update Redux store with fresh user data
      dispatch(updateUser(user));

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(user));
      }

      return user;
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("auth_token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch user profile by username (public profile)
export const useUserProfileByUsername = (username: string) => {
  return useQuery({
    queryKey: ["user-profile", username],
    queryFn: async () => {
      return await getUserProfileByUsername(username);
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfileAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: async (avatarFile: File) => {
      return await updateProfileAvatar(avatarFile);
    },
    onSuccess: (response: UpdateProfileResponse) => {
      // Update Redux store with new avatar URL
      if (currentUser && response.data?.avatarUrl) {
        const updatedUser: User = {
          ...currentUser,
          profile: {
            ...currentUser.profile,
            avatarUrl: response.data.avatarUrl,
          },
        };
        dispatch(updateUser(updatedUser));

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(updatedUser));
        }
      }

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success("Profile avatar updated successfully", {
        description: response.message || "Your profile avatar has been updated",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile avatar. Please try again.";
      toast.error("Failed to update profile avatar", {
        description: errorMessage,
      });
    },
  });
};

export const useUpdateLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      linkId: string;
      title?: string;
      url?: string;
      isVisible?: boolean;
    }) => {
      return await updateLink(variables.linkId, {
        title: variables.title,
        url: variables.url,
        isVisible: variables.isVisible,
      });
    },
    onSuccess: (response: {
      success: boolean;
      message: string;
      data: ProfileLink;
      statusCode: number;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Link updated successfully", {
        description: response.message || "Your link has been updated",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update link. Please try again.";
      toast.error("Failed to update link", {
        description: errorMessage,
      });
    },
  });
};

export const useUpdateLinkWithIcon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { linkId: string; iconFile: File }) => {
      return await updateLinkWithIcon(variables.linkId, variables.iconFile);
    },
    onSuccess: (response: {
      success: boolean;
      message: string;
      data: ProfileLink;
      statusCode: number;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Link icon updated successfully", {
        description: response.message || "Your link icon has been updated",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update link icon. Please try again.";
      toast.error("Failed to update link icon", {
        description: errorMessage,
      });
    },
  });
};

export const useReorderLinks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      links: Array<{ id: string; displayOrder: number }>;
    }) => {
      return await reorderLinks({ links: variables.links });
    },
    onSuccess: (response: {
      success: boolean;
      message: string;
      data: ProfileLink | null;
      statusCode: number;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Links reordered successfully", {
        description: response.message || "Your links have been reordered",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reorder links. Please try again.";
      toast.error("Failed to reorder links", {
        description: errorMessage,
      });
    },
  });
};

export const useDeleteLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { linkId: string }) => {
      return await deleteLink(variables.linkId);
    },
    onSuccess: (response: {
      success: boolean;
      message: string;
      data: ProfileLink | null;
      statusCode: number;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Link deleted successfully", {
        description: response.message || "Your link has been deleted",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete link. Please try again.";
      toast.error("Failed to delete link", {
        description: errorMessage,
      });
    },
  });
};

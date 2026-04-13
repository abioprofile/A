"use client";

import { getCurrentUser } from "@/lib/api/auth.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useAppDispatch } from "@/stores/hooks";
import { setAuth } from "@/stores/slices/auth.slice";

export default function Page() {
  return (
    <Suspense>
      <GoogleCallback />
    </Suspense>
  );
}

function GoogleCallback() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const token = params.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/auth/sign-in");
      return;
    }

    const finishLogin = async () => {
      try {
        // Store token FIRST so the apiClient interceptor sends it with the request
        localStorage.setItem("auth_token", token);

        const response = await getCurrentUser();
        const user = response.data;

        // Persist user data and update Redux state (sets isAuthenticated: true)
        localStorage.setItem("user_data", JSON.stringify(user));
        dispatch(setAuth({ user, token }));

        // Route based on whether onboarding is complete
        if (user?.isOnboardingCompleted === true) {
          router.replace("/dashboard");
        } else {
          router.replace("/auth/username");
        }
      } catch (err) {
        // Token was bad — clean up and send them back to sign-in
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        setError("Google sign-in failed. Please try again.");
      }
    };

    finishLogin();
  }, [token]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FEF4EA]">
        <div className="text-center space-y-4">
          <p className="text-[#331400] font-semibold">{error}</p>
          <button
            onClick={() => router.replace("/auth/sign-in")}
            className="bg-[#FED45C] text-[#331400] font-semibold px-6 py-2"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FEF4EA]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#331400] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[#331400] font-semibold text-sm">Signing you in...</p>
      </div>
    </div>
  );
}

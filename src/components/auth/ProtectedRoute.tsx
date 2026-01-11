"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/sign-in",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if user is authenticated
    // Check both Redux state and localStorage as fallback
    const hasToken = token || localStorage.getItem("auth_token");
    const isAuth = isAuthenticated || hasToken;
    
    if (!isAuth) {
      // Store the current path to redirect back after login
      const currentPath = window.location.pathname;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      
      // Redirect to sign-in page
      router.push(redirectTo);
    }
  }, [isClient, isAuthenticated, token, router, redirectTo]);

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  // Check authentication status
  const hasToken = token || (typeof window !== "undefined" && localStorage.getItem("auth_token"));
  const isAuth = isAuthenticated || hasToken;

  // Show nothing if not authenticated (prevents flash of content)
  if (!isAuth) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}


"use client";

import { getCurrentUser } from "@/lib/api/auth.api";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAppDispatch } from "@/stores/hooks";
import { updateUser } from "@/stores/slices/auth.slice";

export default function Page() {
  return (
    <Suspense>
      <GoogleLogin />
    </Suspense>
  );
}

export function GoogleLogin() {
  const dispatch = useAppDispatch();

  const params = useSearchParams();

  const token = params.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUser();
      const user = response.data;

      dispatch(updateUser(user));

      // console.log(user);
      localStorage.setItem("auth_token", token!);
      localStorage.setItem("user_data", JSON.stringify(user));
      return redirect("/dashboard");
    };

    if (!token) {
      return redirect("/");
    }
    fetchUser();
  }, [token]);

  return <></>;
}

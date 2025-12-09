"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUser, checkUsername } from "@/lib/auth";
import { AuthContext } from "@/context/AuthContext";

const UsernamePage = () => {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const [username, setUsername] = useState("");

  const { user, updateUserData } = useContext(AuthContext); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!username.trim()) {
    toast.error("Please enter a valid username.");
    return;
  }

  if (!user?.id) {
    toast.error("Authentication error. Please log in again.");
    return;
  }

  try {
    // Check username availability
    const res = await checkUsername(username);

    if (!res?.data?.isAvailable) {
      toast.error("Username is already taken. Please choose another one.");
      return;
    }

    // Update user profile using user.id
   const updateRes = await updateUser(
  { username },
  { Authorization: `Bearer ${token}` }
);


    console.log("UPDATED USER:", updateRes);

    // Optionally save to local context
    updateUserData({ username });

    toast.success("Username set!", {
      description: "Your username was saved successfully.",
    });

  
    setTimeout(() => {
      router.push("/auth/goal");
    }, 600);

  } catch (error: any) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Something went wrong.");
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-[#FEF4EA]">
      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-5 max-w-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#331400] mb-1 md:hidden">
              Create Username
            </h1>
            <h1 className="hidden md:block text-3xl lg:text-4xl font-bold text-[#331400] mb-1">
              Claim your free Username
            </h1>
            <p className="text-[#666464] text-sm md:text-base">
              Choose a unique username that represents you.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 lg:max-w-fit relative"
          >
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-lg text-[#4B2E1E] select-none">
                abio.site/
              </span>

              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter unique username"
                className="pl-[100px] pr-12 h-10 text-sm font-medium placeholder:font-medium placeholder:text-gray-500"
                aria-label="Username"
                autoComplete="off"
              />

              {/* Desktop submit icon */}
              <button
                type="submit"
                aria-label="Submit username"
                className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#331400] p-2 rounded-md transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile button */}
            <Button
              type="submit"
              className="w-full lg:hidden bg-[#FED45C] hover:bg-[#f5ca4f] text-[#331400] py-2 font-semibold transition-all"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-4 md:hidden gap-3 py-4  text-sm text-[#331400] mt-auto">
        <p>© 2025 Abio</p>
        <a href="/privacy-policy" className="hover:text-[#000000] transition">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
};

export default UsernamePage;

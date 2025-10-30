"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Username set", {
      description: `You have successfully set your username`,
    });
    router.push("/auth/goal");
  };

  return (
    <div className="my-auto mx-auto flex-col bg-[#FEF4EA] items-center flex justify-center min-h-screen w-full">
      <div className="lg:w-1/2 p-5 max-w-xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center w-full">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-3xl lg:text-4xl text-[#331400] font-bold mb-1">
              Claim your free Username
            </h1>
            <p className="text-[#666464] text-[15px]">
              Choose a unique username that represents you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full lg:max-w-fit">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-xl    text-[#4B2E1E]">
                abio.site/
              </span>

              {/* Input Field */}
              <Input
                id="username"
                type="text"
                value={username}
                placeholder="Enter unique username"
                onChange={(e) => setUsername(e.target.value)}
                className="pl-[110px] pr-12 font-medium text-sm h-10 placeholder:font-medium placeholder:text-sm placeholder:text-gray-500"
              />

              {/* Arrow Button inside Input */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#331400] p-2 flex items-center justify-center transition"
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
          </form>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="relative hidden lg:w-1/2 lg:flex">
        <Image
          src={"/assets/images/auth/username.svg"}
          alt={"Username Splash Image"}
          fill
          priority
          className="object-cover rounded-[2rem] p-2"
        />
      </div>
    </div>
  );
};

export default SignIn;

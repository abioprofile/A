"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckUsername, useUpdateProfile } from "@/hooks/api/useAuth";
import { UpdateProfileResponse } from "@/types/auth.types";
import { useDebounce } from "@/hooks/useDebounce";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAppSelector } from "@/stores/hooks";

const UsernamePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [isMounted, setIsMounted] = useState(false);
  const updateProfileMutation = useUpdateProfile();
  const [username, setUsername] = useState(user?.profile?.username || "");
  const debouncedUsername = useDebounce(username, 500);

  // Check if username matches the user's existing username (case-insensitive)
  const trimmedDebounced = debouncedUsername.trim();
  const currentUsername = user?.profile?.username?.trim().toLowerCase();
  const isOwnUsername = trimmedDebounced.toLowerCase() === currentUsername;

  // Only check availability if:
  // 1. Username is not empty
  // 2. It's NOT their own username
  // 3. Username has actually changed from the debounced value
  const shouldCheckAvailability =
    !!trimmedDebounced &&
    !isOwnUsername &&
    trimmedDebounced.length > 0;

  // Only pass username to the hook if we should check availability
  // This prevents the query from being created/executed when it's their own username
  const usernameToCheck = shouldCheckAvailability ? trimmedDebounced : "";

  const {
    data: usernameData,
    isLoading: isCheckingUsername,
    isError,
  } = useCheckUsername(usernameToCheck, { enabled: shouldCheckAvailability });
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if current username (not debounced) matches the user's existing username for submit
  const isOwnUsernameForSubmit = username.trim().toLowerCase() === user?.profile?.username?.toLowerCase();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      return toast.error("Please enter a username");
    }

    // Check if it's their own username (shouldCheckAvailability is false)
    const trimmedUsername = username.trim();
    const isOwnUsernameForSubmit = trimmedUsername.toLowerCase() === currentUsername;

    // If it's their own username, just redirect without calling the API
    if (isOwnUsernameForSubmit) {
      toast.success("Continuing with your username");
      router.push("/auth/goal");
      return; // Important: return early to skip all validation checks
    }

    // For new/changed usernames, check availability first
    // This check only runs if it's NOT their own username (we returned above if it was)
    if (!usernameData?.data) {
      toast.error("Please wait for username validation");
      return;
    }

    if (usernameData?.data?.isAvailable && usernameData?.data?.isValid) {
      updateProfileMutation.mutate(
        { username: trimmedUsername },
        {
          onSuccess: (response: UpdateProfileResponse) => {
            if (response.success) {
              toast.success("Username updated successfully!");
              router.push("/auth/goal");
            } else {
              toast.error(response.message || "Failed to update profile");
            }
          },
          onError: () => {
            toast.error("Failed to update username");
          },
        }
      );
    } else {
      toast.error("Username is not available", {
        description:
          usernameData?.message || "Please choose a different username",
      });
    }
  };

  const getStatusIcon = () => {
    if (!debouncedUsername || username !== debouncedUsername) {
      return null;
    }

    // If it's their own username, show green checkmark
    const trimmedDebounced = debouncedUsername.trim();
    if (trimmedDebounced.toLowerCase() === currentUsername) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }

    if (isCheckingUsername) {
      return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }

    if (isError) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    if (usernameData?.data) {
      if (usernameData.data.isAvailable && usernameData.data.isValid) {
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      } else {
        return <XCircle className="w-5 h-5 text-red-500" />;
      }
    }

    return null;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const inputVariants: Variants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  const submitButtonVariants: Variants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#f5ca4f",
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    tap: {
      scale: 0.9,
      transition: {
        duration: 0.1,
      },
    },
  };

  const statusMessageVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ProtectedRoute>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col min-h-screen bg-[#FEF4EA]"
      >
        {/* Main content */}
        <div className="flex flex-1 flex-col lg:flex-row items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-5 max-w-xl">
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="mb-6 text-center"
            >
              <motion.h1
                className="text-3xl font-bold text-[#331400] mb-1 md:hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Create Username
              </motion.h1>
              <motion.h1
                className="hidden md:block text-3xl md:text-4xl font-bold text-[#331400] mb-1"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Claim your free Username
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-[#666464] text-sm lg:text-[14px] font-semibold"
              >
                Choose a unique username that represents you.
              </motion.p>
            </motion.div>

            {/* Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="w-full space-y-4 lg:max-w-fit relative"
            >
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                animate="blur"
                className="relative w-full"
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-lg text-[#4B2E1E] select-none pointer-events-none">
                  abio.site/
                </span>

                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter unique username"
                  className="pl-[100px] pr-12 h-10 text-[14px] placeholder:text-[12px] font-medium placeholder:font-medium placeholder:text-gray-500"
                  aria-label="Username"
                  autoComplete="off"
                />

                {/* Status icon */}
                <AnimatePresence mode="wait">
                  {getStatusIcon() && (
                    <motion.div
                      key={debouncedUsername}
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {getStatusIcon()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Desktop submit icon */}
                <AnimatePresence>
                  {username && (
                    <motion.button
                      key="submit-button"
                      variants={submitButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2 }}
                      type="submit"
                      aria-label="Submit username"
                      disabled={
                        updateProfileMutation.isPending ||
                        (isCheckingUsername && !isOwnUsernameForSubmit) ||
                        (!isOwnUsernameForSubmit &&
                          !(
                            usernameData?.data?.isAvailable &&
                            usernameData?.data?.isValid
                          ))
                      }
                      className="hidden cursor-pointer lg:flex absolute right-2 top-1/2 -translate-y-1/2 bg-[#FED45C] hover:bg-[#f5ca4f] disabled:opacity-50 disabled:cursor-not-allowed text-[#331400] p-2 transition-all duration-200"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
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
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Status message */}
              <AnimatePresence mode="wait">
                {debouncedUsername && username === debouncedUsername && (
                  <>
                    {/* Show message for own username */}
                    {isOwnUsername && (
                      <motion.p
                        key={`status-own-${debouncedUsername}`}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={statusMessageVariants}
                        className="text-[12px] font-semibold overflow-hidden text-green-600"
                      >
                        ✓ This is your current username
                      </motion.p>
                    )}
                    {/* Show message for availability check */}
                    {!isOwnUsername &&
                      !isCheckingUsername &&
                      usernameData?.data && (
                        <motion.p
                          key={`status-${debouncedUsername}`}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={statusMessageVariants}
                          className={`text-[12px] font-semibold overflow-hidden ${usernameData.data.isAvailable &&
                              usernameData.data.isValid
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          {usernameData.data.isAvailable &&
                            usernameData.data.isValid
                            ? "✓ Username is available"
                            : usernameData.message ||
                            "Username is not available"}
                        </motion.p>
                      )}
                  </>
                )}
              </AnimatePresence>

              {/* Mobile terms note */}
              <motion.div
                variants={itemVariants}
                className="text-[12px] text-center font-semibold md:hidden max-w-sm"
              >
                <p>
                  By continuing, you agree to receive offers, news and updates
                  from A.Bio.
                </p>
              </motion.div>

              {/* Mobile button */}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                variants={itemVariants}
                disabled={
                  updateProfileMutation.isPending ||
                  (isCheckingUsername && !isOwnUsernameForSubmit) ||
                  (!isOwnUsernameForSubmit &&
                    !(
                      usernameData?.data?.isAvailable &&
                      usernameData?.data?.isValid
                    ))
                }
                className="w-full cursor-pointer bg-[#FED45C] lg:hidden shadow-[4px_4px_0px_0px_#000000] hover:bg-[#f5ca4f] disabled:opacity-50 disabled:cursor-not-allowed text-[#331400] py-2 font-semibold transition-all"
              >
                {updateProfileMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Continue"
                )}
              </motion.button>

            </motion.form>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="w-full flex items-center justify-between px-4 md:hidden gap-3 py-4 text-sm text-[#331400] mt-auto"
        >
          <motion.p
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            © 2025 Abio
          </motion.p>
          <motion.a
            href="/privacy-policy"
            className="hover:text-[#000000] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Privacy Policy
          </motion.a>
        </motion.footer>
      </motion.div>
    </ProtectedRoute>
  );
};

export default UsernamePage;
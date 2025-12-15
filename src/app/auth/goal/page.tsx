"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateProfile } from "@/hooks/api/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type Goal = {
  id: number;
  title: string;
};

const SelectGoalPage = () => {
  const router = useRouter();

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const updateProfileMutation = useUpdateProfile();

  const goals: Goal[] = [
    { id: 1, title: "Grow My Brand" },
    { id: 2, title: "Promote My Content" },
    { id: 3, title: "Sell Products/Services" },
    { id: 4, title: "Share all my Links" },
    { id: 5, title: "Just Exploring" },
  ];

  const handleSubmit = async () => {
    if (!selectedGoal) {
      toast.error("Please select a goal.");
      return;
    }
    if (selectedGoal) {
      updateProfileMutation.mutate({
        goals: [selectedGoal.title],
      });
    }
    if (updateProfileMutation.isSuccess) {
      toast.success("Goal saved successfully", {
        description: "Your profile has been updated.",
      });
      router.push("/auth/platforms");
    }
    if (updateProfileMutation.isError) {
      toast.error("Failed to save goal", {
        description: updateProfileMutation.error.message,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col bg-[#FEF4EA] items-center justify-between min-h-screen p-5">
        {/* Main content */}
        <div className="flex flex-col items-center justify-center flex-grow w-full max-w-xl">
          <div className="text-center space-y-4 mb-5">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#331400]">
              Which best describes your goal for using A.bio
            </h1>
            <p className="text-[#000] text-[15px]">What brings you to A.bio?</p>
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="space-y-4 mb-8">
              {goals.map((goal) => {
                const isSelected = selectedGoal?.id === goal.id;

                return (
                  <div key={goal.id}>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedGoal(goal)}
                      className={cn(
                        "w-full h-16 px-6 rounded-none flex items-center justify-between transition-all border border-gray-300",
                        isSelected
                          ? "bg-[#D9D9D9] border-[#331400]"
                          : "bg-white"
                      )}
                    >
                      <span className="font-semibold">
                        {goal.id}: {goal.title}
                      </span>

                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="12" cy="12" r="12" fill="#000000" />
                          <path
                            d="M17 8L10.5 14.5L7 11"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            <Button
              className={cn(
                "w-full h-10 text-black bg-[#FED45C] font-semibold transition",
                !selectedGoal && "bg-[#D9D9D9] cursor-not-allowed"
              )}
              disabled={!selectedGoal}
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full flex items-center md:hidden justify-between gap-2 py-4 text-sm text-[#331400] mt-8">
          <p>© 2025 Abio</p>

          <a href="/privacy-policy" className="hover:text-[#000000] transition">
            Privacy Policy
          </a>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default SelectGoalPage;

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface OnboardingProgressWithStepsProps {
  currentStep: number;
  totalSteps?: number;
}

export const OnboardingProgressWithSteps = ({ 
  currentStep, 
  totalSteps = 5 
}: OnboardingProgressWithStepsProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="mx-auto max-w-2xl px-4 py-3 sm:px-4">
        {/* Progress bar */}
        <div className="relative mb-2">
          <div className="h-1 w-full bg-gray-200 ">
            <motion.div
              className="h-full bg-[#FED45C] "
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Step indicators: labels hidden on mobile to prevent overflow */}
        <div className="flex justify-between gap-1 sm:gap-2">
          {steps.map((step) => (
            <div
              key={step}
              className="flex min-w-0 flex-shrink flex-col items-center sm:min-w-[4.5rem] sm:shrink-0"
            >
              <motion.div
                className={`flex h-6 w-6 items-center justify-center text-xs font-semibold ${
                  step < currentStep
                    ? "bg-[#FED45C] text-[#331400]"
                    : step === currentStep
                    ? "bg-[#FED45C] text-[#331400] ring-2 ring-[#FED45C] ring-offset-2"
                    : "bg-gray-200 text-gray-500"
                }`}
                initial={false}
                animate={{
                  scale: step === currentStep ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {step < currentStep ? (
                  <Check className="h-3 w-3" />
                ) : (
                  step
                )}
              </motion.div>
              <span className="mt-1 hidden text-center text-xs text-gray-600 whitespace-nowrap sm:block">
                {getStepLabel(step)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getStepLabel = (step: number): string => {
  const labels: Record<number, string> = {
    1: "Username",
    2: "Goal",
    3: "Platforms",
    4: "Links",
    5: "Profile"
  };
  return labels[step] || `Step ${step}`;
};
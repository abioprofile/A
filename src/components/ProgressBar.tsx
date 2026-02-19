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
    <div className="">
      <div className="max-w-2xl mx-auto px-4 py-3">
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

        {/* Step indicators */}
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step} className="flex flex-col items-center">
              <motion.div
                className={`w-6 h-6  flex items-center justify-center text-xs font-semibold ${
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
                  <Check className="w-3 h-3" />
                ) : (
                  step
                )}
              </motion.div>
              <span className="text-xs mt-1 text-gray-600">
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
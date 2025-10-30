"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Goal = {
    id: number
    title: string
}

const SelectGoalPage = () => {
    const router = useRouter()
    const [selectedGoal, setSelectedGoal] = useState<Goal>()

    const goals: Goal[] = [
        { id: 1, title: "Grow My Brand" },
        { id: 2, title: "Promote My Content" },
        { id: 3, title: "Sell Products/Services" },
        { id: 4, title: "Share all my Links" },
        { id: 5, title: "Just Exploring" },
    ]

    const handleGoalSelect = (goal: Goal) => {
        setSelectedGoal(goal)
    }

    const handleSubmit = () => {
        toast("Successful", {
            description: `You have successfully choosen your goal`,
        })
        router.push("/auth/platforms")
    }

    return (
        <div className="flex flex-col bg-[#FEF4EA] items-center justify-center h-screen p-5">
            <div className="w-full max-w-xl">
                <div className="text-center space-y-4 mb-5">
                    <h1 className="text-3xl lg:text-3xl font-bold  bg-clip-text">
                        Which best describes your goal for using A.bio
                    </h1>
                    <p className="text-[#000] text-[15px]">What brings you to A.bio?</p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="space-y-4 mb-8">
                        {goals.map((goal) => {
                            return (
                                <div key={goal.id}>
                                    {selectedGoal?.id === goal.id ? (
                                        <div className="p-[2px] bg-[#331400]">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleGoalSelect(goal)}
                                                className={"w-full h-10 px-6 rounded-none flex items-center justify-between transition-all bg-[#D9D9D9] border border-gray-200 hover:bg-gray-200"}
                                            >
                                                <span className="font-semibold">{goal.id}: {goal.title}</span>
                                                {selectedGoal?.id === goal.id && <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="15"
                                                        height="15"
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
                                                        }
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleGoalSelect(goal)}
                                            className={"w-full h-16 px-6 rounded-none flex items-center justify-between"}
                                        >
                                            <span className="font-semibold">{`${goal.id}: ${goal.title}`}</span>
                                        </Button>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <Button
                        className={cn(
                            "w-full h-10 text-black bg-[#FED45C] font-semibold",
                            !selectedGoal && "bg-[#D9D9D9] cursor-not-allowed",
                        )}
                        disabled={!selectedGoal}
                        onClick={handleSubmit}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default SelectGoalPage
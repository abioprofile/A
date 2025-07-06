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
        router.push("/auth/category")
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen p-5">
            <div className="w-full max-w-xl">
                <div className="text-center space-y-5 mb-5">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                        Which best describes your goal for using A.bio
                    </h1>
                    <p className="text-[#666464]">What brings you to A.bio?</p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="space-y-4 mb-8">
                        {goals.map((goal) => {
                            return (
                                <div key={goal.id}>
                                    {selectedGoal?.id === goal.id ? (
                                        <div className="p-[2px] bg-gradient-to-r from-[#7140EB] to-[#FB8E8E]">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleGoalSelect(goal)}
                                                className={"w-full h-16 px-6 rounded-none flex items-center justify-between transition-all bg-[#D9D9D9] border border-gray-200 hover:bg-gray-200"}
                                            >
                                                <span className="font-semibold">{goal.id}: {goal.title}</span>
                                                {selectedGoal?.id === goal.id && <Image
                                                    src={'/assets/icons/dashboard/blue-check.svg'}
                                                    alt='check icon'
                                                    width={15}
                                                    height={15}
                                                    priority
                                                />}
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
                            "w-full h-12 text-white font-semibold",
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
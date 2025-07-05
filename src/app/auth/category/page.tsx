"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Category = {
    id: string
    name: string
}

const categories: Category[] = [
    { id: "musician", name: "Musician / Artist" },
    { id: "influencer", name: "Influencer / Creator" },
    { id: "entrepreneur", name: "Entrepreneur / Coach" },
    { id: "freelancer", name: "Freelancer / Agency" },
    { id: "local", name: "Local Business" },
    { id: "blogger", name: "Blogger / Writer" },
    { id: "designer", name: "Designer" },
    { id: "nonprofit", name: "Non-Profit / Activist" },
    { id: "photographer", name: "Photograher / Videographer" },
]
const SelectCategoryPage = () => {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)


    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId)
    }

    const handleSubmit = () => {
        toast("Successful", {
            description: `You have successfully choosen your business category`,
        })
        router.push("/auth/template")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center space-y-5 mb-5 max-w-md mx-auto">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                        Select your Business Category
                    </h1>
                    <p className="text-[#666464] text-lg">What&apos;s your business or niche?</p>
                </div>

                <div className="flex flex-wrap justify-center w-full gap-4 mb-8">
                    {categories.map((category) => (
                        <Button
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                            className={cn(
                                "h-12 w-fit px-4 rounded-none border border-[#7140EB] whitespace-nowrap",
                            )}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Button
                        className="max-w-md"
                        disabled={!selectedCategory}
                        onClick={handleSubmit}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default SelectCategoryPage
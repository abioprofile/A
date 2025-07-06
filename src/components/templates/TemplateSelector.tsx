"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { templates } from "@/data"
import { TemplateCard } from "./TemplateCard"
import { initializeTemplateStore, useTemplateStore } from "@/stores/template.store"

const TemplateSelector = () => {
    const router = useRouter()
    const { selectedTemplate, setSelectedTemplate } = useTemplateStore()

    // Initialize store on component mount
    useEffect(() => {
        initializeTemplateStore()
    }, [])

    const handleSelectTemplate = (templateId: string) => {
        const template = templates.find((t) => t.id === templateId)
        if (template) {
            setSelectedTemplate(template)
            router.push("/auth/platforms")
        }
    }

    return (
        <div className="bg-[#E2E2E2] grid grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full p-1 px-5">
            {templates.map((template) => (
                <div key={template.id} className="flex flex-col items-center justify-center">
                    <TemplateCard
                        template={template}
                        onClick={() => handleSelectTemplate(template.id)}
                        isSelected={selectedTemplate?.id === template.id}
                    />
                </div>
            ))}
        </div>
    )
}
export default TemplateSelector
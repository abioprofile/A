import { templates } from "@/data"
import { TemplateConfig } from "@/interfaces/template.interface"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface TemplateState {
    selectedTemplate: TemplateConfig | null
    setSelectedTemplate: (template: TemplateConfig) => void
}

export const useTemplateStore = create<TemplateState>()(
    persist(
        (set) => ({
            selectedTemplate: null,
            setSelectedTemplate: (template) => set({ selectedTemplate: template }),
        }),
        {
            name: "template-storage",
        },
    ),
)

// Initialize with first template if none is selected
export const initializeTemplateStore = () => {
    const { selectedTemplate, setSelectedTemplate } = useTemplateStore.getState()

    if (!selectedTemplate && templates.length > 0) {
        setSelectedTemplate(templates[0])
    }
}

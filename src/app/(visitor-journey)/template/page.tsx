import { TemplateCard } from '@/components/templates/TemplateCard'
import { templates } from '@/data'
import React from 'react'

const TemplatePage = () => {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-5">
                <div className='mb-12 mx-auto'>
                    <h1 className='text-3xl lg:text-5xl font-extrabold text-center tracking-tight leading-16 mb-2'>
                        A.Bio template to <br />
                        suit every brand and creator
                    </h1>
                    <p className='text-center text-lg font-semibold md:px-16 lg:px-24'>
                        Different Link Apps, integrations and visual styles can help you create a Linktree that looks and feels like you and your
                        brand. Explore our library of custom templates to grow and connect with your audience even more easily!
                    </p>
                </div>

                <div className="bg-[#E2E2E2] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full p-1">
                    {templates.map((template) => (
                        <div key={template.id} className="flex flex-col items-center justify-center">
                            <TemplateCard
                                template={template}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default TemplatePage
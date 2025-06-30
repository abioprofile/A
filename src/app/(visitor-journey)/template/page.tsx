"use client"
import { TemplateCard } from '@/components/templates/TemplateCard'
import { templates } from '@/data'
import { useRouter } from 'next/navigation'
import React from 'react'

const TemplatePage = () => {
    const router = useRouter()
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-5">
                <div className='mb-12 mx-auto'>
                    <h1 className='text-3xl lg:text-5xl font-extrabold text-center tracking-tight leading- mb-2'>
                        A.Bio template to <br />
                        suit every brand and creator
                    </h1>
                    <p className='text-center text-base lg:text-lg font-semibold md:px-16 lg:px-24'>
                        Different Link Apps, integrations and visual styles can help you create a Linktree that looks and feels like you and your
                        brand. Explore our library of custom templates to grow and connect with your audience even more easily!
                    </p>
                </div>

                <div className="bg-white md:bg-[#E2E2E2] grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 mx-auto w-full p-1">
                    {templates.map((template) => (
                        <div key={template.id} className="flex flex-col items-center justify-center">
                            <TemplateCard
                                template={template}
                                onClick={() => router.push("/auth/sign-in")}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default TemplatePage
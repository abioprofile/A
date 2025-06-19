import TemplateSelector from "@/components/templates/TemplateSelector"

const TemplateGallery = () => {

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto py-20">
                <div className="mb-16 md:md-8 flex justify-center items-center flex-col">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                        Choose Template
                    </h1>
                    <p className="text-[#666464] font-semibold px-16 text-center">Pick the style that feels right -  you can add your content later.</p>
                </div>

                <TemplateSelector />
            </div>
        </main>
    )
}
export default TemplateGallery
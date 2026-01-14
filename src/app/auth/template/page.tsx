import TemplateSelector from "@/components/templates/TemplateSelector";
import Link from "next/link";
import Image from "next/image";

const TemplateGallery = () => {
  return (
    <main className="min-h-screen bg-[#fef4ea]">
      {/* Logo Section - stays aligned left */}
      <div className="px-4 pt-6 pb-10 md:px-20 md:pt-8 ">
        <Link href="/" className="flex items-end gap-1 group">
          <div>
            <Image
              src="/icons/A.Bio.png"
              alt="A.Bio Logo"
              width={48}
              height={48}
              priority
              className="cursor-pointer select-none"
            />
          </div>
          <span className="text-[#331400] text-3xl font-bold">bio</span>
        </Link>
      </div>
      
      {/* Centered Content Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-5 md:mb-10 flex justify-center items-center flex-col">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 bg-[#331400] text-transparent bg-clip-text">
            Select Template
          </h1>
          <p className="md:font-medium text-sm md:text-[14px] px-16 text-center">
            Pick the style that feels right - you can add your content later.
          </p>
        </div>

        <TemplateSelector />
      </div>
    </main>
  );
};
export default TemplateGallery;
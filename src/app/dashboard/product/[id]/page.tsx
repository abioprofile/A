'use client';
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { FiShoppingCart, FiChevronLeft } from "react-icons/fi";
import { CheckCircle, Star } from "lucide-react";
import Modal from '@/components/ui/modal';
import { useCart } from '@/context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const colorParam = searchParams.get("color");
  const router = useRouter();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);
  const defaultColor = product?.colors?.[0]?.code || "";
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [activeImage, setActiveImage] = useState("");
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  useEffect(() => {
    if (colorParam && product?.colors?.some(c => c.code === colorParam)) {
      setSelectedColor(colorParam);
    }
  }, [colorParam, product]);

  useEffect(() => {
    if (!product) return;

    const colorObj = product.colors?.find(c => c.code === selectedColor);

    if (colorObj) {
      setActiveImage(colorObj.mainImage);
      setCurrentGallery(colorObj.gallery);
    } else {
      setActiveImage(product.defaultImage);
      setCurrentGallery(product.defaultGallery || []);
    }
  }, [product, selectedColor]);

  const currentColor = product?.colors?.find(c => c.code === selectedColor);
  const colorName = currentColor?.name || "";
  const galleryImages = [activeImage, ...currentGallery].filter(Boolean);

  const handleAddToCart = () => {
    if (!product) return;

    const colorObj = product.colors?.find(c => c.code === selectedColor);

    addToCart({
      id: product.id,
      name: product.name,
      color: colorObj?.name || '',
      price: product.basePrice,
      image: activeImage,
    });

    router.push('/dashboard/store/cart');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/dashboard/store" 
            className="flex font-medium items-center text-purple-600 hover:underline"
          >
            <FiChevronLeft />
            Back to Store
          </Link>
          <span className="font-bold">{product.name}</span>
        </div>

        <div className="bg-white py-8 shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row gap-16 p-6">
            {/* Image section */}
            <div className="w-full md:w-1/2">
              <div className="sticky top-4">
                <div className="flex flex-col-reverse md:flex-row gap-8">
                  <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                    {galleryImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`flex-shrink-0 w-16 h-16 overflow-hidden border-1 ${
                          img === activeImage ? "border-[#7140EB]" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${colorName ? `in ${colorName}` : ''} view ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 flex items-center justify-center bg-gray-100 aspect-square">
                    <Image
                      src={activeImage}
                      alt={`${product.name} ${colorName ? `in ${colorName}` : ''}`}
                      width={500}
                      height={500}
                      className="object-contain w-full h-full p-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info section */}
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-2xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-[13px] font-semibold">4.9 (205 reviews)</span>
              </div>

              <p className="text-[12px] font-bold mb-0">Price</p>
              <div className="text-3xl font-bold mb-[16px]">
                ₦{product.basePrice.toLocaleString()}
              </div>
              <p className="text-sm font-thin mb-2">Delivery calculated at checkout</p>
              <hr className="border-[0.5] border-gray-600 w-[50%]" />

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  {colorName && <p className="font-semibold">Color: {colorName}</p>}
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.code}
                        onClick={() => setSelectedColor(color.code)}
                        className={`w-10 h-10 border-1 flex items-center justify-center ${
                          color.code === "#FFFFFF" ? "border-gray-300" : "border-transparent"
                        } ${selectedColor === color.code ? "ring-2 ring-purple-600" : ""}`}
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      >
                        {selectedColor === color.code && (
                          <CheckCircle className="w-4 h-4 text-white mix-blend-difference" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && (
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-[12px]">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add to cart or customize */}
              <div className="pt-4">
                {product.id === "ap-card-5-plus" ? (
                  <button
                    onClick={() => setShowCustomizeModal(true)}
                    className="w-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white py-3 px-6 font-semibold"
                  >
                    Customize Your Card
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white font-semibold py-3 px-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      <Modal className="w-[30%]" isOpen={showCustomizeModal} onClose={() => setShowCustomizeModal(false)}>
        <div className="space-y-4">
          <h1 className="text-center font-bold">Customize your card</h1>
          <div className="border border-dashed border-gray-400 p-6 flex flex-col items-center justify-center text-center">
            <Image src="/icons/upload.svg" alt="Upload" width={40} height={40} />
            <p className="text-[15px] font-thin mt-2">Select file to upload,<br />Allowed file types: Jpeg, PNG</p>
          </div>
          <input type="text" placeholder="User name" className="w-full border px-4 py-2 text-sm" />
          <input type="text" placeholder="Preferred Color" className="w-full border px-4 py-2 text-sm" />
          <textarea
            placeholder="Describe how you want this image to appear on the card and other information you would be needing..."
            className="w-full placeholder:text-[13px] border px-4 py-2 text-sm"
            rows={4}
          />
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white font-semibold py-3 px-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FiShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetailPage;

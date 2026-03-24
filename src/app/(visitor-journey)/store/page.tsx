"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const STORE_PRODUCTS = [
  {
    id: "ap-card-5",
    name: "Ap Card 5",
    description: "The last business card you'll ever need.",
    priceLabel: "From N35,000",
    image: "/icons/store-card-1.svg",
    imageAlt: "Ap card 5 image",
  },
  {
    id: "ap-card-5-plus-custom",
    name: "Ap Card 5+ Custom",
    description: "The last business card you'll ever need.",
    priceLabel: "From N50,000",
    image: "/icons/store-card-2.svg",
    imageAlt: "Ap card 5+ image",
  },
] as const;

export default function Store() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <main className="min-h-screen bg-[#FEF4EA] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl md:text-4xl font-extrabold">
            All Products
          </h1>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <Input
                onBlur={() => setShowSearch(false)}
                placeholder="Search..."
                className={`transition-all duration-300 ${
                  showSearch ? "w-40 opacity-100" : "w-0 opacity-0"
                }`}
              />
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Image src="/icons/search.svg" alt="search" width={18} height={18} />
              </button>
            </div>

            <Image src="/icons/cart.svg" alt="cart" width={20} height={20} />
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {STORE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center text-center space-y-4"
            >
              <Image
                src={product.image}
                alt={product.imageAlt}
                width={320}
                height={320}
                className="w-[260px] md:w-[320px]"
              />

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {product.description}
                </p>
                <p className="text-[#331400] text-lg font-semibold">
                  {product.priceLabel}
                </p>
              </div>

              <Button
                asChild
                className="bg-[#FED45C] text-[#331400] px-6 py-3 font-semibold shadow-[4px_4px_0px_#000]"
              >
                <Link href={`/store/onboarding/${product.id}`}>
                  Buy Now
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
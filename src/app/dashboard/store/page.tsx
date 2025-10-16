'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

const StorePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold ">All Products</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 " />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border text-[12px]  w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 rounded-full hover:bg-gr relative"onClick={() => router.push("/dashboard/store/cart")}
              aria-label="View Cart">
              <FiShoppingCart className="text-xl" />
              {cart.length > 0 &&( 
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
              )}
              
            </button>
          </div>
        </div>
        <div className="bg-white py-10 px-20">
          <div className="flex justify-between items-center">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className=" overflow-hidden "
            >
              <div 
                className="relative h-90 w-90 cursor-pointer"
                onClick={() => router.push(`/dashboard/product/${product.id}`)}
              >
                <Image
                  src={product.defaultImage}
                  alt={product.name}
                  fill
                  className="object-contain w-100 h-80 hover:shadow-lg transition-shadow duration-300"
                />
              </div>
              
              <div className="p-4">
                <div className="flex flex-col justify-between items-start">
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p className="text-[#A097B5] font-bold">
                    ₦{product.basePrice.toLocaleString()}
                  </p>
                </div>

                {product.colors && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/product/${product.id}?color=${encodeURIComponent(color.code)}`
                            );
                          }}
                          className={`w-6 h-6  border-2 ${
                            color.code === "#FFFFFF" ? "border-gray-300" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default StorePage;






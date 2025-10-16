'use client';

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const CartPage = () => {
  const { cart, clearCart, removeFromCart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="flex flex-col mt-6 space-y-1 items-center mb-4">
        <h1 className="text-3xl font-bold">Cart</h1>
        <Link href="/dashboard/store" className=" hover:underline text-[14px]">
          Continue ordering
        </Link>
      </div>

      <div className="p-14 bg-white max-w-5xl mx-auto space-y-6">

        {cart.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty.</p>
            <Link href="/dashboard/store" className="text-purple-600 underline text-sm">
              Back to store
            </Link>
          </div>
        ) : (
          <>
            {/* Product and Total Header */}
            <div className="flex justify-between border-b-1 border-b-black pb-2 font-bold text-[18px] uppercase tracking-wider">
              <span>Product</span>
              <span>Total</span>
            </div>

            {/* Cart Items */}
            {cart.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center justify-between border-b-1 border-b-black pb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="bg-white p-4 shadow-md border"
                    width={200}
                    height={200}
                  />
                  <div>
                    <h2 className="font-bold text-[19px]">{item.name}</h2>
                    <p className="text-[11px] font-thin">Color: {item.color}</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end md:gap-2 mt-4 md:mt-0">
                  <p className="font-bold text-[19px]">₦{item.price.toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="text-red-500 text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Features + Subtotal */}
            <div className="flex flex-col md:flex-row justify-between gap-8 border-b pb-4">
              <div className="space-y-2 text-[12px] font-thin">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>iOS & Android Compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Secure NFC Technology</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Durable Stainless Steel</span>
                </div>
              </div>

              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex justify-between font-bold text-[19px]">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[14px] font-semibold border-t-1 border-t-black pt-2">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>
            </div>

            {/* Checkout Section */}
            <div className="flex flex-col space-y-4 items-center mt-8">
              <p className="text-xs text-gray-600">Delivery calculated at checkout</p>
              <button className="w-[30%] bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white font-semibold py-3  hover:opacity-90">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;



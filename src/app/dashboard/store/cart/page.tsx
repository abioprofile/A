'use client';

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, ShoppingBagIcon, ArrowLeftIcon, CreditCardIcon, ShieldCheckIcon, TruckIcon, RefreshCwIcon } from "lucide-react";

const CartPage = () => {
  const { cart, clearCart, removeFromCart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const handleRemoveItem = (index: number) => {
    removeFromCart(index);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/dashboard/store"
              className="inline-flex items-center gap-2 bg-[#331400] text-white px-6 py-3 rounded-lg hover:bg-[#442000] transition-colors font-semibold"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/store"
              className="flex items-center gap-2 text-gray-600 hover:text-[#331400] transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm">Continue Shopping</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
            <div className="w-24" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items Section */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              <AnimatePresence mode="popLayout">
                {cart.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Product Info */}
                        <div className="flex gap-4 flex-1">
                          <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                              {item.name}
                            </h3>
                            {item.color && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">Color:</span>
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-200"
                                  style={{ backgroundColor: item.color.toLowerCase() }}
                                />
                                <span className="text-xs text-gray-600">{item.color}</span>
                              </div>
                            )}
                            <div className="md:hidden mt-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs text-gray-500">Price:</span>
                                  <span className="ml-2 font-semibold text-gray-900">
                                    ₦{item.price.toLocaleString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(idx)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price - Desktop */}
                        <div className="hidden md:block text-center w-32">
                          <span className="font-medium text-gray-900">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Quantity - Desktop */}
                        <div className="hidden md:block text-center w-32">
                          <span className="text-gray-600">1</span>
                        </div>

                        {/* Total - Desktop */}
                        <div className="hidden md:block text-right w-32">
                          <span className="font-semibold text-gray-900">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Remove Button - Desktop */}
                        <div className="hidden md:block">
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Features Section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Why shop with us?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-gray-600">Free Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCwIcon className="w-5 h-5 text-orange-600" />
                  <span className="text-xs text-gray-600">7-Day Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCardIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-xs text-gray-600">Multiple Payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-[#331400]">₦{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                </div>

                {/* Promo Code */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#331400] focus:ring-1 focus:ring-[#331400]"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-[#331400] text-white py-3 rounded-lg font-semibold hover:bg-[#442000] transition-colors mt-4">
                  Proceed to Checkout
                </button>

                <p className="text-center text-xs text-gray-500">
                  Delivery calculated at checkout
                </p>

                {/* Payment Methods */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center mb-3">We accept</p>
                  <div className="flex justify-center gap-3">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">Visa</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">Mastercard</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">Paystack</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">Flutterwave</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Shopping Link */}
            <Link
              href="/dashboard/store"
              className="block text-center mt-4 text-sm text-gray-500 hover:text-[#331400] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
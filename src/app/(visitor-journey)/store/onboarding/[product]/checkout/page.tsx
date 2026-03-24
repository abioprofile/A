"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getStoreProduct } from "@/lib/store-onboarding";

export default function StoreCheckoutPage() {
  const params = useParams<{ product: string }>();
  const searchParams = useSearchParams();
  const productId = params?.product ?? "";

  const product = useMemo(() => getStoreProduct(productId), [productId]);

  if (!product) return null;

  const fullName = searchParams.get("fullName") ?? "";
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const cardName = searchParams.get("cardName") ?? "";
  const brandInstruction = searchParams.get("brandInstruction") ?? "";
  const deliveryAddress = searchParams.get("deliveryAddress") ?? "";

  return (
    <main className="min-h-screen bg-[#FEF4EA] py-16 px-4">
      <div className="max-w-xl mx-auto bg-white border p-6 md:p-10 space-y-6">
        <div>
          <p className="text-xs text-gray-500">Store checkout</p>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Order */}
        <div className="border p-5 rounded-md space-y-2">
          <p className="font-semibold">Order summary</p>
          <p>Product: {product.name}</p>
          <p>Price: N{product.basePrice.toLocaleString()}</p>
          <p>Card name: {cardName || "-"}</p>
          {product.id === "ap-card-5-plus-custom" && (
            <p>Brand: {brandInstruction || "-"}</p>
          )}
        </div>

        {/* Buyer */}
        <div className="border p-5 rounded-md space-y-2">
          <p className="font-semibold">Buyer details</p>
          <p>Name: {fullName}</p>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
          <p>Delivery: {deliveryAddress}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 border-t pt-6 flex flex-col sm:flex-row gap-4 sm:justify-between">
  <Button
    asChild
    variant="outline"
    className="w-full sm:w-auto"
  >
    <Link href={`/store/onboarding/${product.id}`}>Back</Link>
  </Button>

  <Button className="w-full sm:w-auto bg-[#331400] text-white hover:bg-[#4a2207]">
    Place order
  </Button>
</div>
      </div>
    </main>
  );
}
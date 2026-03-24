"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoreProduct } from "@/lib/store-onboarding";

export default function StoreOnboardingPage() {
  const router = useRouter();
  const params = useParams<{ product: string }>();
  const productId = params?.product ?? "";

  const product = useMemo(() => getStoreProduct(productId), [productId]);

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [brandInstruction, setBrandInstruction] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FEF4EA] flex items-center justify-center">
        <div className="bg-white border p-6 text-center">
          <h1 className="font-bold">Product not found</h1>
          <Button asChild>
            <Link href="/store">Back</Link>
          </Button>
        </div>
      </main>
    );
  }

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const startCheckout = () => {
    const query = new URLSearchParams({
      fullName,
      email,
      phone,
      cardName,
      brandInstruction,
      deliveryAddress,
    });

    router.push(`/store/onboarding/${product.id}/checkout?${query}`);
  };

  return (
    <main className="min-h-screen bg-[#FEF4EA] py-16 px-4">
      <div className="max-w-xl mx-auto bg-white border p-6 md:p-10">
        <p className="text-xs text-gray-500">Store onboarding</p>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-600">{product.description}</p>

        {/* Progress */}
        <div className="flex gap-2 my-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 ${
                s <= step ? "bg-[#331400]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Steps */}
        {step === 1 && (
          <div className="space-y-4">
            <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input placeholder="Card name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
            {product.id === "ap-card-5-plus-custom" && (
              <Input placeholder="Brand instruction" value={brandInstruction} onChange={(e) => setBrandInstruction(e.target.value)} />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Input placeholder="Delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row gap-4 sm:justify-between">
  <Button
    type="button"
    variant="outline"
    onClick={back}
    disabled={step === 1}
    className="w-full sm:w-auto"
  >
    Back
  </Button>

  {step < 3 ? (
    <Button
      type="button"
      onClick={next}
      className="w-full sm:w-auto bg-[#FED45C] text-[#331400] hover:bg-[#f7c93d]"
    >
      Continue
    </Button>
  ) : (
    <Button
      type="button"
      onClick={startCheckout}
      className="w-full sm:w-auto bg-[#331400] text-white hover:bg-[#4a2207]"
    >
      Continue to checkout
    </Button>
  )}
</div>
      </div>
    </main>
  );
}
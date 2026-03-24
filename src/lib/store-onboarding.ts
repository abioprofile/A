export interface StoreProduct {
  id: "ap-card-5" | "ap-card-5-plus-custom";
  name: string;
  basePrice: number;
  description: string;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "ap-card-5",
    name: "Ap Card 5",
    basePrice: 35000,
    description: "Standard NFC business card with fast setup.",
  },
  {
    id: "ap-card-5-plus-custom",
    name: "Ap Card 5+ Custom",
    basePrice: 50000,
    description: "Premium custom NFC card tailored to your brand.",
  },
];

export function getStoreProduct(productId: string): StoreProduct | undefined {
  return STORE_PRODUCTS.find((p) => p.id === productId);
}

export type ProductColor = {
  code: string;
  name: string;
  mainImage: string;
  gallery: string[];
};

export type Product = {
  id: string;
  name: string;
  basePrice: number;
  defaultImage: string;
  defaultGallery?: string[];
  colors?: ProductColor[];
  features?: string[];
  description?: string;
};

export const products: Product[] = [
  {
    id: "ap-card-5",
    name: "AP Card 5",
    basePrice: 35000,
    defaultImage: "/icons/Apcard5.png",
    defaultGallery: [
      "/icons/Apcard5.png",
      "/icons/Apcard5.png",
    ],
    colors: [
      {
        code: "#000000",
        name: "Onyx Black",
        mainImage: "/images/Blackcard3.png",
        gallery: [
          "/images/Blackcard3.png",
          "/images/Apcard 5 white back.png",
          "/images/Blackcard1 (1).png",
          "/images/Blackcard2.png",
        ],
      },
      {
        code: "#FFFFFF",
        name: "Pearl White",
        mainImage: "/images/Apcard 5 white 1.png",
        gallery: [
          "/images/Apcard 5 white 1.png",
          "/images/Apcard 5 white back.png",
          "/images/A5 w 1.png",
          "/images/WHite card.png",
        ],
      },
      {
        code: "#F28B82",
        name: "Coral Blush",
        mainImage: "/images/pink card 3.png",
        gallery: [
          "/images/pink card 3.png",
          "/images/Apcard 5 white back.png",
          "/images/pink card 2.png",
          "/images/Pink card.png",
        ],
      },
    ],
    features: [
      "iOS & Android Compatible",
      "Secure NFC Technology",
      "Durable Stainless Steel",
    ],
  },
  {
    id: "ap-card-5-plus",
    name: "AP Card 5+ Custom",
    basePrice: 50000,
    defaultImage: "/icons/Apcard 5 2.png",
    
    features: [
      "iOS & Android Compatible",
      "Secure & Trusted",
      "In stock, ready to Deliver",
    ],
    
  },
];

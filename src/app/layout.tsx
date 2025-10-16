import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import localFont from "next/font/local"; // 👈 import for local fonts
import { CartProvider } from "@/context/CartContext";

// Metadata
export const metadata: Metadata = {
  title: "A official website",
  description: "A",
};

// Inter (Google)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Satoshi (Local)
const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi", // 👈 use as CSS variable
  display: "swap",
});

const monumentExtended = localFont ({
  src:[
    {
      path: "../fonts/MonumentExtended-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/MonumentExtended-Ultrabold.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-monumentExtended", // 👈 use as CSS variable
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${satoshi.variable} ${monumentExtended.variable}`} // 👈 now both available
    >
      <body className="max-[320px]:text-sm antialiased">
        <CartProvider>
          {children}
          <Toaster theme="light" richColors />
        </CartProvider>
      </body>
    </html>
  );
}


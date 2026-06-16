import type { Metadata } from "next";
// @ts-ignore: Allow side-effect CSS import without type declarations
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { HapticsInit } from "@/components/HapticsInit";

export const metadata: Metadata = {
  title: "Abio - One Link. Endless Connections",
  description: "Share everything about yourself in one tap. Abio is your smart link-in-bio with NFC Powered netwroking.",
  icons: {
    icon:'/icons/A.bio.svg',
  }
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
  variable: "--font-satoshi",
  display: "swap",
});

const monumentExtended = localFont({
  src: [
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
  variable: "--font-monumentExtended",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${satoshi.variable} ${monumentExtended.variable}`}
    >
      <body className="max-[320px]:text-sm antialiased">
        <ReduxProvider>
          <QueryProvider>
            <AuthProvider>
              <CartProvider>
                <HapticsInit />
                {children}
                <Toaster theme="light" richColors />
              </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

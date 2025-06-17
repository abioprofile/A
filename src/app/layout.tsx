import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: "A official website",
  description: "A",
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`max-[320px]:text-sm antialiased`}
      >
        {children}
        <Toaster
          theme="light"
          richColors
        />
      </body>
    </html>
  );
}

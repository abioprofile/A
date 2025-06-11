import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/partials/NavBar";
import Footer from "@/components/partials/Footer";

export const metadata: Metadata = {
  title: "A official website",
  description: "A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`max-[320px]:text-sm antialiased`}
      >
        <NavBar />
        {children}
        <Footer />
        <Toaster
          theme="light"
          richColors
        />
      </body>
    </html>
  );
}

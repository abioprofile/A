import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

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
        {children}
        <Toaster
          theme="light"
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Jokyo.io - Learning Programming System",
  description: "A programming system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}

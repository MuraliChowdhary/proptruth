import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css";
import { Footer } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:       "PropTruth — Verified Property Condition Intelligence",
  description: "AI-powered property condition reports anchored on blockchain. Know the truth before you sign.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col">
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  )
}
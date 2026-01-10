import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRaysBG from "./components/LightRaysBG";
import Navbar from "./components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description:
    "The Hub for every developer built using NextJS@16 by dev.hussain125",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased relative overflow-x-hidden`}
      >
        <Navbar />
        {/* Background */}
        <LightRaysBG />

        {/* Foreground */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}

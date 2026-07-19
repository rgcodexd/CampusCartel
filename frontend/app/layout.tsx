import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Merriweather, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Nav } from "../components/nav";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const body = Merriweather({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Campus Cartel",
  description: "Trusted college-only marketplace for renting and reselling.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-[var(--font-body)]">
        <Nav />
        {children}
      </body>
    </html>
  );
}

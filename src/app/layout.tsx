import type { Metadata } from "next";
import { Inter } from "next/font/google";
import FluidCursor from "@/components/FluidCursor";
import { SiteEffectsProvider } from "@/context/SiteEffectsContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daniel Duque | AI-Driven Leader & Developer",
  description:
    "Portfolio of Daniel Duque. Tech leader and developer with 15+ years of experience shipping AI-powered products, leading engineering teams, and driving product strategy from startup to enterprise scale.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Daniel Duque | AI-Driven Leader & Developer",
    description:
      "15+ years shipping AI-powered products, leading engineering teams, and driving product strategy from startup to enterprise scale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased grain`}>
        {/* Hidden form for Netlify form detection during deploy */}
        <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input type="text" name="name" />
          <input type="email" name="email" />
          <textarea name="message" />
        </form>
        <SiteEffectsProvider>
          <FluidCursor />
          {children}
        </SiteEffectsProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Providers } from "./providers";

// Global styles
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/animate.css";
import "@/styles/flaticon.css";
import "@/styles/font-awesome.min.css";
import "@/styles/themify-icons.css";
import "@/styles/sass/style.scss";

// Metadata for the page
export const metadata: Metadata = {
  title: "Daniel Duque's Portfolio",
  description: "Full Stack Developer",
  icons: {
    icon: [
      { rel: "apple-touch-icon", sizes: "57x57", url: "/apple-icon-57x57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", url: "/apple-icon-60x60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", url: "/apple-icon-72x72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", url: "/apple-icon-76x76.png" },
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        url: "/apple-icon-114x114.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        url: "/apple-icon-120x120.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        url: "/apple-icon-144x144.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        url: "/apple-icon-152x152.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-icon-180x180.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-icon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

/**
 * Root layout for the app
 * @param children - The children components
 * @returns The root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

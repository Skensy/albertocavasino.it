import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/lib/content-context";
import ColorVarsInjector from "@/lib/color-vars-injector";
import SeoInjector from "@/lib/seo-injector";
import ScrollProgress from "@/components/ScrollProgress";
import staticContent from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: staticContent.seo?.title || "Designer Portfolio",
  description: staticContent.seo?.description || "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <ColorVarsInjector />
      </head>
      <body className="relative min-h-full flex flex-col text-white font-sans overflow-x-hidden">
        <SeoInjector />
        <ScrollProgress />
        <div className="noise-bg" aria-hidden="true" />
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}

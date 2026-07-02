import type { Metadata } from "next";
import "./globals.css";
import { ContentProvider } from "@/lib/content-context";
import ColorVarsInjector from "@/lib/color-vars-injector";
import FontInjector from "@/lib/font-injector";
import SeoInjector from "@/lib/seo-injector";
import ScrollProgress from "@/components/ScrollProgress";
import staticContent from "@/lib/content";

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
      className="h-full antialiased"
    >
      <head>
        <ColorVarsInjector />
        <FontInjector />
      </head>
      <body className="relative min-h-full flex flex-col text-brand-900 font-sans overflow-x-hidden">
        <SeoInjector />
        <ScrollProgress />
        <div className="apple-bg" aria-hidden="true" />
        <div className="noise-bg" aria-hidden="true" />
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}

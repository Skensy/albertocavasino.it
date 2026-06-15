import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import content from "@/lib/content";

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
  title: "Alessandro Rizzo | Graphic Designer",
  description:
    "Graphic designer con anni di esperienza in agenzia: siti web, brochure, locandine, loghi, marchi e brand identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { colors } = content;

  const colorVars = `
    :root {
      --color-accent: ${colors.primary};
      --color-accent-hover: ${colors.primaryHover};
      --color-brand-50: ${colors.bgLight};
      --color-brand-900: ${colors.textPrimary};
      --color-brand-700: ${colors.textSecondary};
      --color-brand-950: ${colors.bgDark};
    }
  `;

  return (
    <html
      lang="it"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorVars }} />
      </head>
      <body className="relative min-h-full flex flex-col bg-gradient-to-br from-brand-50 via-white to-brand-100 text-brand-800 font-sans overflow-x-hidden">
        {/* Decorative glass blobs — liquid depth effect */}
        <div className="noise-bg" aria-hidden="true" />
        <div
          className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-accent/10 blur-3xl animate-float pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-brand-300/20 blur-3xl animate-pulse-soft pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="fixed top-[40%] right-[-5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-brand-200/10 blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: "-3s", animationDuration: "8s" }}
          aria-hidden="true"
        />
        {children}
      </body>
    </html>
  );
}

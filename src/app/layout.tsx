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

/* ── Color helpers ── */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function hexToRgbArray(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Mix a color toward black (factor 0 → untouched, 1 → black) */
function shade(hex: string, factor: number): string {
  const [r, g, b] = hexToRgbArray(hex);
  return rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor));
}

/** Mix a color toward white (factor 0 → untouched, 1 → white) */
function tint(hex: string, factor: number): string {
  const [r, g, b] = hexToRgbArray(hex);
  return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { colors } = content;
  const { primary, primaryHover, bgLight, bgDark, textPrimary, textSecondary, navBg } = colors;

  const colorVars = `
    :root {
      --user-accent: ${primary};
      --user-accent-hover: ${primaryHover};
      --user-accent-rgb: ${hexToRgb(primary)};
      --user-nav-bg-rgb: ${hexToRgb(navBg)};
      --user-brand-50: ${bgLight};
      --user-brand-100: ${tint(primary, 0.85)};
      --user-brand-200: ${tint(primary, 0.65)};
      --user-brand-300: ${tint(primary, 0.45)};
      --user-brand-400: ${primary};
      --user-brand-500: ${primaryHover};
      --user-brand-600: ${shade(primary, 0.25)};
      --user-brand-700: ${textSecondary};
      --user-brand-800: ${shade(primary, 0.55)};
      --user-brand-900: ${textPrimary};
      --user-brand-950: ${bgDark};
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
          className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-accent/5 blur-3xl animate-float pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-brand-300/10 blur-3xl animate-pulse-soft pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="fixed top-[40%] right-[-5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-brand-200/5 blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: "-3s", animationDuration: "8s" }}
          aria-hidden="true"
        />
        {children}
      </body>
    </html>
  );
}

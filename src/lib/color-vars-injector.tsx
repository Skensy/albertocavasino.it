"use client";

import { useContent } from "@/lib/content-context";

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  return `${parseInt(h.substring(0, 2), 16)} ${parseInt(h.substring(2, 4), 16)} ${parseInt(h.substring(4, 6), 16)}`;
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
  return "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
}

function shade(hex: string, factor: number): string {
  const [r, g, b] = hexToRgbArray(hex);
  return rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor));
}

function tint(hex: string, factor: number): string {
  const [r, g, b] = hexToRgbArray(hex);
  return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
}

export default function ColorVarsInjector() {
  const { colors } = useContent();
  const {
    primary, primaryHover, bgLight, bgDark,
    textPrimary, textSecondary, navBg,
    serviceNumberColor, serviceNumberOpacity,
  } = colors;

  // Combine hex + opacity into rgba
  const [sr, sg, sb] = hexToRgbArray(serviceNumberColor || "#FFFFFF");
  const serviceNumberRgba = `rgba(${sr},${sg},${sb},${(serviceNumberOpacity ?? 5) / 100})`;

  const colorVars = `
    :root {
      --user-accent: ${primary};
      --user-accent-hover: ${primaryHover};
      --user-accent-rgb: ${hexToRgb(primary)};
      --user-nav-bg-rgb: ${hexToRgb(navBg)};
      --user-text-primary: ${textPrimary};
      --user-text-secondary: ${textSecondary};

      /* Brand scale: anchored at textSecondary (brand-400) instead of derived from textPrimary */
      --user-brand-50: ${bgLight};
      --user-brand-100: ${bgLight};
      --user-brand-200: ${tint(textSecondary, 0.5)};
      --user-brand-300: ${tint(textSecondary, 0.35)};
      --user-brand-400: ${textSecondary};
      --user-brand-500: ${shade(textSecondary, 0.2)};
      --user-brand-600: ${shade(textSecondary, 0.38)};
      --user-brand-700: ${shade(textSecondary, 0.55)};
      --user-brand-800: ${bgLight};
      --user-brand-900: ${textPrimary};
      --user-brand-950: ${bgDark};

      --user-bg: ${bgLight};

      --color-accent: ${primary};
      --color-accent-rgb: ${hexToRgb(primary)};

      /* Service number color (hex + opacity combined) */
      --user-service-number: ${serviceNumberRgba};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: colorVars }} />;
}

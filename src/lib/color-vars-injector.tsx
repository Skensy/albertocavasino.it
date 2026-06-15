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

  return <style dangerouslySetInnerHTML={{ __html: colorVars }} />;
}

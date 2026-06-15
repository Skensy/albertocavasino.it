"use client";

import { useContent } from "@/lib/content-context";

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  return `${parseInt(h.substring(0, 2), 16)} ${parseInt(h.substring(2, 4), 16)} ${parseInt(h.substring(4, 6), 16)}`;
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
      --user-brand-100: ${bgLight};
      --user-brand-200: #D4D4D4;
      --user-brand-300: #A3A3A3;
      --user-brand-400: #737373;
      --user-brand-500: #585858;
      --user-brand-600: #444444;
      --user-brand-700: #333333;
      --user-brand-800: #1C1C1C;
      --user-brand-900: #0D0D0D;
      --user-brand-950: ${bgDark};
      --color-accent: ${primary};
      --color-accent-rgb: ${hexToRgb(primary)};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: colorVars }} />;
}

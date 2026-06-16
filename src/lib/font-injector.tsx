"use client";

import { useContent } from "@/lib/content-context";

function fontToUrl(family: string): string {
  const encoded = family.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700&display=swap`;
}

export default function FontInjector() {
  const { typography } = useContent();

  const sansFont = typography?.sansFont || "Inter";
  const serifFont = typography?.serifFont || "Playfair Display";
  const sansUrl = fontToUrl(sansFont);
  const serifUrl = fontToUrl(serifFont);

  const cssVars = `
    :root {
      --user-font-sans: "${sansFont}", ui-sans-serif, system-ui, sans-serif;
      --user-font-serif: "${serifFont}", Georgia, serif;
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={sansUrl} rel="stylesheet" />
      <link href={serifUrl} rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
    </>
  );
}

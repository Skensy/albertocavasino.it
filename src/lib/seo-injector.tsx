"use client";

import { useEffect } from "react";
import { useContent } from "@/lib/content-context";

export default function SeoInjector() {
  const { seo, site } = useContent();

  useEffect(() => {
    if (seo?.title) {
      document.title = seo.title;
    } else {
      document.title = `${site.name} | ${site.role}`;
    }
    if (seo?.description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", seo.description);
    }
  }, [seo, site]);

  return null;
}

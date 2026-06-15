"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { SiteContent } from "@/lib/content";
import staticContent from "@/lib/content";

const ContentContext = createContext<SiteContent>(staticContent);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(staticContent);

  useEffect(() => {
    const preview = localStorage.getItem("preview_content");
    if (preview) {
      try {
        const parsed: SiteContent = JSON.parse(preview);
        setContent(parsed);
      } catch {
        /* invalid JSON, ignore */
      }
    }
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

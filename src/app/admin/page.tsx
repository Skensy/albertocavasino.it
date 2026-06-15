"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content";
import { fetchContent, saveContent } from "@/lib/github-api";
import { availableServiceIconNames } from "@/lib/icons";

/* ── Pre-computed SHA-256 hash of the default password "admin" ── */
const ADMIN_PASSWORD_HASH =
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";

/* ── Default content (fallback if fetch fails) ── */
const DEFAULT_CONTENT: SiteContent = {
  site: { name: "Alessandro Rizzo", role: "Graphic Designer" },
  nav: [
    { label: "Home", href: "#home" },
    { label: "Chi Sono", href: "#about" },
    { label: "Servizi", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contatti", href: "#contact" },
  ],
  hero: {
    bgImage: "",
    bgAlt: "Creative workspace",
    badge: "Graphic Designer",
    headingLine1: "Disegno idee,",
    headingAccent: "costruisco identità.",
    subtitle: "",
    ctaText: "Vedi i miei lavori",
    ctaHref: "#portfolio",
  },
  about: {
    photoUrl: "",
    photoAlt: "Alessandro Rizzo — Graphic Designer",
    title: "Chi Sono",
    paragraphs: [""],
    skills: [
      { label: "Siti Web", icon: "🌐" },
      { label: "Brochure", icon: "📄" },
      { label: "Locandine", icon: "🎨" },
      { label: "Loghi", icon: "✏️" },
      { label: "Marchi", icon: "🏷️" },
      { label: "Brand Identity", icon: "✨" },
    ],
  },
  services: {
    title: "Cosa Faccio",
    subtitle: "",
    items: [
      { title: "", description: "", iconName: "star" },
    ],
  },
  portfolio: {
    title: "Portfolio",
    subtitle: "",
    projects: [{ title: "", category: "", src: "" }],
  },
  contact: {
    title: "Contattami",
    subtitle: "",
    email: "",
    phone: "",
    location: "",
    formLabels: {
      name: "Nome",
      namePlaceholder: "",
      email: "Email",
      emailPlaceholder: "",
      message: "Messaggio",
      messagePlaceholder: "",
      submit: "Invia messaggio",
    },
    sidebarTitle: "Informazioni",
    socialTitle: "Social",
    socials: [
      { label: "LinkedIn", url: "#", iconName: "linkedin" },
      { label: "Instagram", url: "#", iconName: "instagram" },
      { label: "Behance", url: "#", iconName: "behance" },
    ],
  },
  footer: {
    linkSectionTitle: "Link",
    socialSectionTitle: "Social",
    footerLinks: ["Chi Sono", "Servizi", "Portfolio", "Contatti"],
    copyright: "© {year} Alessandro Rizzo. Tutti i diritti riservati.",
  },
  colors: {
    primary: "#FFA620",
    primaryHover: "#E8960A",
    bgLight: "#1C1C1C",
    bgDark: "#000000",
    textPrimary: "#FFFFFF",
    textSecondary: "#9F9F9F",
    navBg: "#000000",
  },
  seo: {
    title: "Designer Portfolio | UI/UX Designer",
    description: "Portfolio di un UI/UX designer con anni di esperienza in agenzia, specializzato in siti web, brochure e brand identity.",
  },
};

/* ── Section tabs ── */
type SectionKey =
  | "general"
  | "hero"
  | "about"
  | "services"
  | "portfolio"
  | "contact"
  | "navigation"
  | "colors"
  | "seo"
  | "footer";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "general", label: "Generale" },
  { key: "hero", label: "Hero" },
  { key: "about", label: "Chi Sono" },
  { key: "services", label: "Servizi" },
  { key: "portfolio", label: "Portfolio" },
  { key: "contact", label: "Contatti" },
  { key: "navigation", label: "Navigazione" },
  { key: "colors", label: "Colori" },
  { key: "seo", label: "SEO" },
  { key: "footer", label: "Footer" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

/* ═══════════════════════════════════════════════
   AdminPage component
   ═══════════════════════════════════════════════ */
export default function AdminPage() {
  /* ── Auth state ── */
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [pat, setPat] = useState("");
  const [loginError, setLoginError] = useState("");

  /* ── Editor state ── */
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [sha, setSha] = useState("");
  const [currentSection, setCurrentSection] = useState<SectionKey>("general");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [originalContent, setOriginalContent] = useState<SiteContent | null>(null);
  const [diffOpen, setDiffOpen] = useState(false);
  const [noChanges, setNoChanges] = useState(false);

  /* Restore PAT from sessionStorage on mount */
  useEffect(() => {
    const saved = sessionStorage.getItem("gh_pat");
    if (saved) setPat(saved);
  }, []);

  /* ── Login handler ── */
  const handleLogin = useCallback(async () => {
    const hash = await sha256(password);
    if (hash !== ADMIN_PASSWORD_HASH) {
      setLoginError("Password errata.");
      return;
    }
    sessionStorage.setItem("gh_pat", pat);
    setAuthenticated(true);
    setLoginError("");

    /* Fetch current content from GitHub */
    try {
      const result = await fetchContent(pat);
      const parsed: SiteContent = JSON.parse(result.content);
      setContent(parsed);
      setOriginalContent(parsed);
      setSha(result.sha);
    } catch {
      /* If fetch fails, use default content */
      setLoginError("Impossibile caricare i contenuti. Verifica il PAT.");
      setAuthenticated(false);
    }

    /* Check for pending content in localStorage */
    checkPendingContent();
  }, [password, pat]);

  /* ── Queue / Publish handlers ── */
  const checkPendingContent = useCallback(() => {
    const stored = localStorage.getItem("pending_content");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const count = Object.keys(parsed).length;
        setPendingCount(count > 0 ? count : 0);
      } catch {
        localStorage.removeItem("pending_content");
      }
    }
  }, []);

  const handleQueue = useCallback(() => {
    localStorage.setItem("pending_content", JSON.stringify(content));
    setPendingCount((prev) => prev + 1);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 1500);
  }, [content]);

  const handleDiscardPending = useCallback(() => {
    localStorage.removeItem("pending_content");
    setPendingCount(0);
  }, []);

  const handlePublish = useCallback(async () => {
    const toPublish = content;

    /* Check if anything actually changed */
    if (originalContent && JSON.stringify(toPublish) === JSON.stringify(originalContent)) {
      setNoChanges(true);
      setSaveStatus("saved");
      setSaveError("");
      setTimeout(() => { setSaveStatus("idle"); setNoChanges(false); }, 2500);
      return;
    }
    setNoChanges(false);

    setSaveStatus("saving");
    setSaveError("");
    try {
      const pat2 = sessionStorage.getItem("gh_pat") || pat;
      const json = JSON.stringify(toPublish, null, 2);
      const newSha = await saveContent(pat2, json, sha);
      setSha(newSha);
      localStorage.removeItem("pending_content");
      setPendingCount(0);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore sconosciuto";
      setSaveError(msg);
      setSaveStatus("error");
    }
  }, [content, sha, pat]);

  /* ── Content updater helpers ── */
  const update = (path: string[], value: unknown) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]] as Record<string, unknown>;
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateArrItem = (path: string[], index: number, key: string, value: unknown) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      let obj: unknown = next;
      for (const segment of path) {
        obj = (obj as Record<string, unknown>)[segment];
      }
      const arr = obj as unknown[];
      (arr[index] as Record<string, unknown>)[key] = value;
      return next;
    });
  };

  const addArrItem = (path: string[], template: Record<string, unknown>) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      let obj: unknown = next;
      for (const segment of path) {
        obj = (obj as Record<string, unknown>)[segment];
      }
      const arr = obj as unknown[];
      arr.push(template);
      return next;
    });
  };

  const removeArrItem = (path: string[], index: number) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      let obj: unknown = next;
      for (const segment of path) {
        obj = (obj as Record<string, unknown>)[segment];
      }
      const arr = obj as unknown[];
      arr.splice(index, 1);
      return next;
    });
  };

  /* ══ Login screen ══ */
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
          <h1 className="font-serif text-2xl font-semibold text-gray-100 mb-6 text-center">
            Dashboard
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="github_pat_..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Serve un PAT con permesso <code>Contents: Read and Write</code> sul repo.
              </p>
            </div>

            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Accedi
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══ Editor screen ══ */
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/90 border-b border-gray-800 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold text-gray-100">
          Dashboard
        </h1>
        <div className="flex items-center gap-3">
          {saveStatus === "saved" && !noChanges && (
            <span className="text-sm text-green-400">✓ Pubblicato</span>
          )}
          {saveStatus === "saved" && noChanges && (
            <span className="text-sm text-amber-400">✓ Già aggiornato</span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-red-400">Errore: {saveError}</span>
          )}
          {saveStatus === "saving" && (
            <span className="text-sm text-gray-400">Pubblicazione...</span>
          )}

          {pendingCount > 0 && (
            <button
              onClick={() => setDiffOpen(!diffOpen)}
              className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-2 py-1 rounded-lg font-medium transition-colors"
            >
              {diffOpen ? "▼" : "📋"} {pendingCount} in coda
            </button>
          )}

          <button
            onClick={() => {
              localStorage.setItem("preview_content", JSON.stringify(content));
              window.open("/", "_blank");
            }}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium px-3 py-2 rounded-xl text-sm transition-colors"
          >
            👁 Anteprima
          </button>

          <button
            onClick={handleQueue}
            disabled={saveStatus === "saving"}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium px-4 py-2 rounded-xl text-sm disabled:opacity-50 transition-colors"
          >
            Accoda modifiche
          </button>

          <button
            onClick={handlePublish}
            disabled={saveStatus === "saving"}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2 rounded-xl text-sm disabled:opacity-50 transition-colors"
          >
            📤 Pubblica tutto
          </button>
        </div>
      </header>

      {/* Pending content restore banner */}
      {pendingCount > 0 && (() => {
        const stored = localStorage.getItem("pending_content");
        if (!stored) return null;
        return (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between">
            <p className="text-sm text-amber-300">
              Hai {pendingCount} modifica{pendingCount > 1 ? "e" : ""} in coda, non ancora pubblicata{pendingCount > 1 ? "e" : ""} su GitHub.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(stored);
                    setContent(parsed);
                    handleDiscardPending();
                  } catch { /* ignore */ }
                }}
                className="text-xs bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 px-3 py-1 rounded-lg transition-colors"
              >
                Ripristina modifiche
              </button>
              <button
                onClick={handleDiscardPending}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg transition-colors"
              >
                Scarta
              </button>
            </div>
          </div>
        );
      })()}

      {/* Pending diff viewer */}
      {diffOpen && pendingCount > 0 && (() => {
        if (!originalContent) return null;
        try {
          const diffs = getPendingDiff(
            originalContent as unknown as Record<string, unknown>,
            content as unknown as Record<string, unknown>
          );
          if (diffs.length === 0) return null;
          return (
            <div className="bg-gray-900/80 border-b border-gray-700 px-6 py-3 max-h-64 overflow-y-auto">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Modifiche in coda ({diffs.length})
              </h3>
              <div className="space-y-1 text-xs font-mono">
                {diffs.slice(0, 30).map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gray-500 shrink-0 w-2">{">"}</span>
                    <span className="text-gray-400 shrink-0">{d.path}</span>
                    <span className="text-red-400 line-through">{d.old}</span>
                    <span className="text-green-400">{d.new}</span>
                  </div>
                ))}
                {diffs.length > 30 && (
                  <p className="text-gray-500 pt-1">...e altre {diffs.length - 30} modifiche</p>
                )}
              </div>
            </div>
          );
        } catch {
          return null;
        }
      })()}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-gray-800 p-4 hidden md:block">
          <nav className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setCurrentSection(s.key)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentSection === s.key
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main editor area */}
        <main className="flex-1 p-6 overflow-auto">
          {currentSection === "general" && (
            <SectionGeneral content={content} update={update} />
          )}
          {currentSection === "hero" && (
            <SectionHero content={content} update={update} />
          )}
          {currentSection === "about" && (
            <SectionAbout content={content} update={update} />
          )}
          {currentSection === "services" && (
            <SectionServices
              content={content}
              update={update}
              updateArrItem={updateArrItem}
              addArrItem={addArrItem}
              removeArrItem={removeArrItem}
            />
          )}
          {currentSection === "portfolio" && (
            <SectionPortfolio
              content={content}
              update={update}
              updateArrItem={updateArrItem}
              addArrItem={addArrItem}
              removeArrItem={removeArrItem}
            />
          )}
          {currentSection === "contact" && (
            <SectionContact content={content} update={update} />
          )}
          {currentSection === "navigation" && (
            <SectionNav
              content={content}
              update={update}
              updateArrItem={updateArrItem}
              addArrItem={addArrItem}
              removeArrItem={removeArrItem}
            />
          )}
          {currentSection === "seo" && (
            <SectionSeo content={content} update={update} />
          )}
          {currentSection === "colors" && (
            <SectionColors content={content} update={update} />
          )}
          {currentSection === "footer" && (
            <SectionFooter content={content} update={update} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Section sub-components
   ═══════════════════════════════════════════════ */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  rows?: number;
}) {
  const cls =
    "w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">
        {label}
      </label>
      {rows ? (
        <textarea
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/* ── General ── */
function SectionGeneral({
  content,
  update,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
}) {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Generale
      </h2>
      <InputField
        label="Nome del sito"
        value={content.site.name}
        onChange={(v) => update(["site", "name"], v)}
      />
      <InputField
        label="Ruolo / Sottotitolo"
        value={content.site.role}
        onChange={(v) => update(["site", "role"], v)}
      />
    </div>
  );
}

/* ── Hero ── */
function SectionHero({
  content,
  update,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
}) {
  const h = content.hero;
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Hero
      </h2>
      <InputField
        label="URL immagine sfondo"
        value={h.bgImage}
        onChange={(v) => update(["hero", "bgImage"], v)}
      />
      <InputField
        label="Testo alt immagine"
        value={h.bgAlt}
        onChange={(v) => update(["hero", "bgAlt"], v)}
      />
      <InputField
        label="Badge"
        value={h.badge}
        onChange={(v) => update(["hero", "badge"], v)}
      />
      <InputField
        label="Titolo (prima parte)"
        value={h.headingLine1}
        onChange={(v) => update(["hero", "headingLine1"], v)}
      />
      <InputField
        label="Titolo (accent)"
        value={h.headingAccent}
        onChange={(v) => update(["hero", "headingAccent"], v)}
      />
      <InputField
        label="Sottotitolo"
        value={h.subtitle}
        onChange={(v) => update(["hero", "subtitle"], v)}
        rows={3}
      />
      <InputField
        label="Testo CTA"
        value={h.ctaText}
        onChange={(v) => update(["hero", "ctaText"], v)}
      />
      <InputField
        label="Link CTA"
        value={h.ctaHref}
        onChange={(v) => update(["hero", "ctaHref"], v)}
      />
    </div>
  );
}

/* ── About ── */
function SectionAbout({
  content,
  update,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
}) {
  const a = content.about;
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Chi Sono
      </h2>
      <InputField
        label="URL foto"
        value={a.photoUrl}
        onChange={(v) => update(["about", "photoUrl"], v)}
      />
      <InputField
        label="Testo alt foto"
        value={a.photoAlt}
        onChange={(v) => update(["about", "photoAlt"], v)}
      />
      <InputField
        label="Titolo sezione"
        value={a.title}
        onChange={(v) => update(["about", "title"], v)}
      />
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Paragrafi (HTML supportato)
        </label>
        <p className="text-xs text-gray-500 mb-2">
          HTML supportato: <code>{'<strong>testo</strong>'}</code> grassetto, <code>{'<em>testo</em>'}</code> corsivo, ecc.
        </p>
        {a.paragraphs.map((p, i) => (
          <div key={i} className="mb-3">
            <div className="flex gap-2 mb-1">
              <textarea
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm font-mono"
                value={p}
                onChange={(e) => {
                  const next = [...a.paragraphs];
                  next[i] = e.target.value;
                  update(["about", "paragraphs"], next);
                }}
                rows={2}
              />
              <button
                onClick={() => {
                  const next = a.paragraphs.filter((_, j) => j !== i);
                  update(["about", "paragraphs"], next);
                }}
                className="text-red-400 hover:text-red-600 text-sm shrink-0"
              >
                ✕
              </button>
            </div>
            {/* Live HTML preview */}
            {p.trim() && (
              <div
                className="text-sm text-gray-300 bg-gray-900/60 rounded-lg px-3 py-2 border border-gray-700/50 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            )}
          </div>
        ))}
        <button
          onClick={() => {
            const next = [...a.paragraphs, ""];
            update(["about", "paragraphs"], next);
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline-offset-2"
        >
          + Aggiungi paragrafo
        </button>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Skill (etichetta ⬄ icona)
        </label>
        {a.skills.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input
              className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
              value={s.label}
              onChange={(e) => {
                const next = [...a.skills];
                next[i] = { ...next[i], label: e.target.value };
                update(["about", "skills"], next);
              }}
              placeholder="Etichetta"
            />
            <input
              className="w-16 px-2 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm text-center"
              value={s.icon}
              onChange={(e) => {
                const next = [...a.skills];
                next[i] = { ...next[i], icon: e.target.value };
                update(["about", "skills"], next);
              }}
              placeholder="🌐"
            />
            <button
              onClick={() => {
                const next = a.skills.filter((_, j) => j !== i);
                update(["about", "skills"], next);
              }}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const next = [...a.skills, { label: "", icon: "✨" }];
            update(["about", "skills"], next);
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline-offset-2"
        >
          + Aggiungi skill
        </button>
      </div>
    </div>
  );
}

/* ── Services ── */
function SectionServices({
  content,
  update,
  updateArrItem,
  addArrItem,
  removeArrItem,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
  updateArrItem: (path: string[], index: number, key: string, val: unknown) => void;
  addArrItem: (path: string[], template: Record<string, unknown>) => void;
  removeArrItem: (path: string[], index: number) => void;
}) {
  const s = content.services;
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Servizi
      </h2>
      <InputField
        label="Titolo sezione"
        value={s.title}
        onChange={(v) => update(["services", "title"], v)}
      />
      <InputField
        label="Sottotitolo"
        value={s.subtitle}
        onChange={(v) => update(["services", "subtitle"], v)}
        rows={2}
      />
      {s.items.map((item, i) => (
        <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Servizio {i + 1}
            </span>
            <button
              onClick={() => removeArrItem(["services", "items"], i)}
              className="text-red-400 hover:text-red-600 text-xs"
            >
              Rimuovi
            </button>
          </div>
          <input
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={item.title}
            onChange={(e) => updateArrItem(["services", "items"], i, "title", e.target.value)}
            placeholder="Titolo"
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={item.description}
            onChange={(e) =>
              updateArrItem(["services", "items"], i, "description", e.target.value)
            }
            rows={2}
            placeholder="Descrizione"
          />
          <select
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={item.iconName}
            onChange={(e) =>
              updateArrItem(["services", "items"], i, "iconName", e.target.value)
            }
          >
            {availableServiceIconNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        onClick={() =>
          addArrItem(["services", "items"], {
            title: "",
            description: "",
            iconName: "star",
          })
        }
        className="text-xs text-indigo-400 hover:text-indigo-300 underline-offset-2"
      >
        + Aggiungi servizio
      </button>
    </div>
  );
}

/* ── Portfolio ── */
function SectionPortfolio({
  content,
  update,
  updateArrItem,
  addArrItem,
  removeArrItem,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
  updateArrItem: (path: string[], index: number, key: string, val: unknown) => void;
  addArrItem: (path: string[], template: Record<string, unknown>) => void;
  removeArrItem: (path: string[], index: number) => void;
}) {
  const p = content.portfolio;
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Portfolio
      </h2>
      <InputField
        label="Titolo sezione"
        value={p.title}
        onChange={(v) => update(["portfolio", "title"], v)}
      />
      <InputField
        label="Sottotitolo"
        value={p.subtitle}
        onChange={(v) => update(["portfolio", "subtitle"], v)}
        rows={2}
      />
      {p.projects.map((proj, i) => (
        <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Progetto {i + 1}
            </span>
            <button
              onClick={() => removeArrItem(["portfolio", "projects"], i)}
              className="text-red-400 hover:text-red-600 text-xs"
            >
              Rimuovi
            </button>
          </div>
          <input
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={proj.title}
            onChange={(e) =>
              updateArrItem(["portfolio", "projects"], i, "title", e.target.value)
            }
            placeholder="Titolo"
          />
          <input
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={proj.category}
            onChange={(e) =>
              updateArrItem(["portfolio", "projects"], i, "category", e.target.value)
            }
            placeholder="Categoria"
          />
          <input
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={proj.src}
            onChange={(e) =>
              updateArrItem(["portfolio", "projects"], i, "src", e.target.value)
            }
            placeholder="URL immagine"
          />
        </div>
      ))}
      <button
        onClick={() =>
          addArrItem(["portfolio", "projects"], {
            title: "",
            category: "",
            src: "",
          })
        }
        className="text-xs text-indigo-400 hover:text-indigo-300 underline-offset-2"
      >
        + Aggiungi progetto
      </button>
    </div>
  );
}

/* ── Contact ── */
function SectionContact({
  content,
  update,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
}) {
  const c = content.contact;
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Contatti
      </h2>
      <InputField label="Titolo" value={c.title} onChange={(v) => update(["contact", "title"], v)} />
      <InputField
        label="Sottotitolo"
        value={c.subtitle}
        onChange={(v) => update(["contact", "subtitle"], v)}
        rows={2}
      />
      <InputField label="Email" value={c.email} onChange={(v) => update(["contact", "email"], v)} />
      <InputField label="Telefono" value={c.phone} onChange={(v) => update(["contact", "phone"], v)} />
      <InputField
        label="Località"
        value={c.location}
        onChange={(v) => update(["contact", "location"], v)}
      />
      <h3 className="text-sm font-semibold text-gray-300 mt-6 mb-2">
        Etichette form
      </h3>
      <InputField
        label="Nome campo"
        value={c.formLabels.name}
        onChange={(v) => update(["contact", "formLabels", "name"], v)}
      />
      <InputField
        label="Placeholder Nome"
        value={c.formLabels.namePlaceholder}
        onChange={(v) => update(["contact", "formLabels", "namePlaceholder"], v)}
      />
      <InputField
        label="Email campo"
        value={c.formLabels.email}
        onChange={(v) => update(["contact", "formLabels", "email"], v)}
      />
      <InputField
        label="Placeholder Email"
        value={c.formLabels.emailPlaceholder}
        onChange={(v) => update(["contact", "formLabels", "emailPlaceholder"], v)}
      />
      <InputField
        label="Messaggio campo"
        value={c.formLabels.message}
        onChange={(v) => update(["contact", "formLabels", "message"], v)}
      />
      <InputField
        label="Placeholder Messaggio"
        value={c.formLabels.messagePlaceholder}
        onChange={(v) => update(["contact", "formLabels", "messagePlaceholder"], v)}
      />
      <InputField
        label="Bottone invio"
        value={c.formLabels.submit}
        onChange={(v) => update(["contact", "formLabels", "submit"], v)}
      />
      <InputField
        label="Titolo sidebar"
        value={c.sidebarTitle}
        onChange={(v) => update(["contact", "sidebarTitle"], v)}
      />
      <InputField
        label="Titolo social"
        value={c.socialTitle}
        onChange={(v) => update(["contact", "socialTitle"], v)}
      />
    </div>
  );
}

/* ── Navigation ── */
function SectionNav({
  content,
  update,
  updateArrItem,
  addArrItem,
  removeArrItem,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
  updateArrItem: (path: string[], index: number, key: string, val: unknown) => void;
  addArrItem: (path: string[], template: Record<string, unknown>) => void;
  removeArrItem: (path: string[], index: number) => void;
}) {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Navigazione
      </h2>
      {content.nav.map((link, i) => (
        <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Link {i + 1}
            </span>
            <button
              onClick={() => removeArrItem(["nav"], i)}
              className="text-red-400 hover:text-red-600 text-xs"
            >
              Rimuovi
            </button>
          </div>
          <input
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={link.label}
            onChange={(e) => updateArrItem(["nav"], i, "label", e.target.value)}
            placeholder="Etichetta"
          />
          <input
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
            value={link.href}
            onChange={(e) => updateArrItem(["nav"], i, "href", e.target.value)}
            placeholder="#sezione"
          />
        </div>
      ))}
      <button
        onClick={() => addArrItem(["nav"], { label: "", href: "#" })}
        className="text-xs text-indigo-400 hover:text-indigo-300 underline-offset-2"
      >
        + Aggiungi link
      </button>
    </div>
  );
}

/* ── SEO ── */
function SectionSeo({
  content,
  update,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
}) {
  const { seo, hero, about, services, portfolio, contact } = content;

  const headingStructure = [
    { tag: "H1", text: `${hero.headingLine1} ${hero.headingAccent}`, section: "Hero" },
    { tag: "H2", text: about.title, section: "Chi Sono" },
    { tag: "H2", text: services.title, section: "Servizi" },
    { tag: "H2", text: portfolio.title, section: "Portfolio" },
    { tag: "H2", text: contact.title, section: "Contatti" },
    { tag: "H3", text: content.site.name, section: "Footer" },
  ];

  return (
    <div className="max-w-xl space-y-5">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        SEO &amp; Titoli
      </h2>

      <div className="space-y-4">
        <InputField
          label="Titolo browser (title tag)"
          value={seo?.title || ""}
          onChange={(v) => update(["seo", "title"], v)}
        />
        <InputField
          label="Meta description"
          value={seo?.description || ""}
          onChange={(v) => update(["seo", "description"], v)}
          rows={3}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          🏷️ Struttura titoli del sito
        </h3>
        <div className="space-y-1.5">
          {headingStructure.map((h) => (
            <div
              key={h.tag + h.text}
              className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2"
            >
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/15 px-1.5 py-0.5 rounded shrink-0">
                {h.tag}
              </span>
              <span className="text-xs text-gray-300 truncate flex-1">
                {h.text || "(vuoto)"}
              </span>
              <span className="text-[10px] text-gray-500 shrink-0">
                &rarr; {h.section}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 mt-2">
          I titoli si modificano nelle rispettive sezioni (Hero, Chi Sono, Servizi, ecc.)
        </p>
      </div>
    </div>
  );
}

/* ── Colors ── */
function SectionColors({
  content,
  update,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
}) {
  const { colors } = content;

  const fields: {
    label: string;
    key: keyof SiteContent["colors"];
    desc: string;
    mockup: (color: string, bgLight: string) => ReactNode;
  }[] = [
    {
      label: "Colore primario (accent)",
      key: "primary",
      desc: "Icone servizi, divider, link hover, glow effects, bottoni, bg-accent/10",
      mockup: (c) => (
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: c }}>
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500">Icone</span>
        </div>
      ),
    },
    {
      label: "Hover primario",
      key: "primaryHover",
      desc: "Stato hover di bottoni e link accent, variante pi\u00f9 scura del primario",
      mockup: (c) => (
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded border border-dashed border-gray-500 flex items-center justify-center" style={{ backgroundColor: c }}>
            <span className="text-[9px] text-white font-bold">H</span>
          </div>
          <span className="text-[10px] text-gray-500">Hover</span>
        </div>
      ),
    },
    {
      label: "Sfondo chiaro",
      key: "bgLight",
      desc: "Sfondo principale del sito e navbar dopo scroll, gradienti di base",
      mockup: (c, _) => (
        <div className="flex items-center gap-1">
          <div className="w-9 h-6 rounded border border-gray-600" style={{ backgroundColor: c }} />
          <span className="text-[10px] text-gray-500">Sfondo sito</span>
        </div>
      ),
    },
    {
      label: "Sfondo scuro (footer)",
      key: "bgDark",
      desc: "Sfondo del footer, usato anche per overlay scuri nell'hero",
      mockup: (c) => (
        <div className="flex items-center gap-1">
          <div className="w-9 h-6 rounded flex items-center justify-center" style={{ backgroundColor: c }}>
            <span className="text-[8px] text-white/70 font-medium">Footer</span>
          </div>
          <span className="text-[10px] text-gray-500">Footer</span>
        </div>
      ),
    },
    {
      label: "Testo titoli",
      key: "textPrimary",
      desc: "Titoli sezioni (h1, h2, h3), nome del brand nel logo, testo principale",
      mockup: (c) => (
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold leading-none" style={{ color: c }}>Aa</span>
          <span className="text-[10px] text-gray-500">Titoli</span>
        </div>
      ),
    },
    {
      label: "Testo corpo",
      key: "textSecondary",
      desc: "Paragrafi, descrizioni servizi, label form, testi secondari",
      mockup: (c) => (
        <div className="flex items-center gap-1">
          <span className="text-[10px] leading-tight max-w-[60px]" style={{ color: c }}>
            Lorem ipsum dolor sit amet
          </span>
          <span className="text-[10px] text-gray-500">Corpo</span>
        </div>
      ),
    },
    {
      label: "Sfondo navbar (dopo scroll)",
      key: "navBg",
      desc: "Sfondo della navbar dopo aver scrollato, semi-trasparente",
      mockup: (c) => (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: c + "80" }}>
            <span className="text-[8px] font-medium" style={{ color: "#fff" }}>Nav</span>
          </div>
          <span className="text-[10px] text-gray-500">Navbar</span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-xl space-y-5">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Colori
      </h2>
      <p className="text-sm text-gray-400">
        Personalizza la palette del sito. I cambiamenti saranno visibili dopo la pubblicazione.
      </p>

      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <label className="block text-xs font-medium text-gray-300 mb-1">
              {field.label}
            </label>
            <p className="text-[11px] text-gray-500 mb-2.5 leading-relaxed">
              {field.desc}
            </p>
            <div className="flex items-center gap-3">
              {/* Color swatch + picker */}
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-lg border border-gray-600 shrink-0"
                  style={{ backgroundColor: colors[field.key] }}
                />
                <input
                  type="color"
                  value={colors[field.key]}
                  onChange={(e) =>
                    update(["colors", field.key], e.target.value)
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title={field.label}
                />
              </div>
              {/* Hex input */}
              <input
                type="text"
                value={colors[field.key]}
                onChange={(e) =>
                  update(["colors", field.key], e.target.value)
                }
                className="w-28 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm font-mono"
                placeholder="#000000"
              />
              {/* Contextual mockup */}
              <div className="ml-auto shrink-0">
                {field.mockup(colors[field.key], colors.bgLight)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Palette preview */}
      <div className="mt-6">
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Anteprima palette completa
        </label>
        <div className="flex gap-2">
          {fields.map((field) => (
            <div
              key={field.key}
              className="w-10 h-10 rounded-lg border border-gray-700"
              style={{ backgroundColor: colors[field.key] }}
              title={`${field.label}: ${colors[field.key]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Footer ── */
function SectionFooter({
  content,
  update,
}: {
  content: SiteContent;
  update: (path: string[], val: unknown) => void;
}) {
  const f = content.footer;
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-serif text-xl font-semibold text-gray-100 mb-4">
        Footer
      </h2>
      <InputField
        label="Titolo sezione link"
        value={f.linkSectionTitle}
        onChange={(v) => update(["footer", "linkSectionTitle"], v)}
      />
      <InputField
        label="Titolo sezione social"
        value={f.socialSectionTitle}
        onChange={(v) => update(["footer", "socialSectionTitle"], v)}
      />
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Link footer
        </label>
        {f.footerLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 text-sm"
              value={link}
              onChange={(e) => {
                const next = [...f.footerLinks];
                next[i] = e.target.value;
                update(["footer", "footerLinks"], next);
              }}
            />
            <button
              onClick={() => {
                const next = f.footerLinks.filter((_, j) => j !== i);
                update(["footer", "footerLinks"], next);
              }}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const next = [...f.footerLinks, ""];
            update(["footer", "footerLinks"], next);
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline-offset-2"
        >
          + Aggiungi link
        </button>
      </div>
      <InputField
        label="Copyright (usa {year} per l'anno corrente)"
        value={f.copyright}
        onChange={(v) => update(["footer", "copyright"], v)}
        rows={2}
      />
    </div>
  );
}

/* ── Diff computation for pending changes viewer ── */
function getPendingDiff(
  original: Record<string, unknown>,
  pending: Record<string, unknown>,
  prefix = ""
): Array<{ path: string; old: string; new: string }> {
  const results: Array<{ path: string; old: string; new: string }> = [];

  const allKeys = new Set([...Object.keys(original), ...Object.keys(pending)]);

  for (const key of allKeys) {
    const op = original[key];
    const np = pending[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (op === np) continue;

    if (typeof np === "string" && typeof op === "string") {
      results.push({
        path,
        old: op.length > 50 ? op.substring(0, 50) + "..." : op,
        new: np.length > 50 ? np.substring(0, 50) + "..." : np,
      });
    } else if (Array.isArray(np) && Array.isArray(op)) {
      const opStr = JSON.stringify(op);
      const npStr = JSON.stringify(np);
      results.push({
        path: `${path}[]`,
        old: opStr.length > 50 ? opStr.substring(0, 50) + "..." : opStr,
        new: npStr.length > 50 ? npStr.substring(0, 50) + "..." : npStr,
      });
    } else if (
      typeof np === "object" && typeof op === "object" &&
      np !== null && op !== null && !Array.isArray(np) && !Array.isArray(op)
    ) {
      const sub = getPendingDiff(
        op as Record<string, unknown>,
        np as Record<string, unknown>,
        path
      );
      results.push(...sub);
    } else if (op !== np) {
      results.push({
        path,
        old: op !== undefined ? String(op) : "(vuoto)",
        new: np !== undefined ? String(np) : "(vuoto)",
      });
    }
  }

  return results;
}

/* ── Utility: SHA-256 hash via Web Crypto API ── */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

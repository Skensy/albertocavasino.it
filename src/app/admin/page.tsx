"use client";

import { useState, useEffect, useCallback } from "react";
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
  | "footer";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "general", label: "Generale" },
  { key: "hero", label: "Hero" },
  { key: "about", label: "Chi Sono" },
  { key: "services", label: "Servizi" },
  { key: "portfolio", label: "Portfolio" },
  { key: "contact", label: "Contatti" },
  { key: "navigation", label: "Navigazione" },
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
      setSha(result.sha);
    } catch {
      /* If fetch fails, use default content */
      setLoginError("Impossibile caricare i contenuti. Verifica il PAT.");
      setAuthenticated(false);
    }
  }, [password, pat]);

  /* ── Save handler ── */
  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    setSaveError("");
    try {
      const pat2 = sessionStorage.getItem("gh_pat") || pat;
      const json = JSON.stringify(content, null, 2);
      await saveContent(pat2, json, sha);
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
        <div className="glass-card rounded-2xl p-8 w-full max-w-md">
          <h1 className="font-serif text-2xl font-semibold text-brand-900 mb-6 text-center">
            Dashboard
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-brand-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="github_pat_..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-brand-800"
              />
              <p className="text-xs text-brand-400 mt-1">
                Serve un PAT con permesso <code>Contents: Read and Write</code> sul repo.
              </p>
            </div>

            {loginError && (
              <p className="text-sm text-red-500">{loginError}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full glass-button text-white font-medium px-6 py-2.5 rounded-xl"
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
      <header className="glass-nav-scrolled sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold text-brand-900">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          {saveStatus === "saved" && (
            <span className="text-sm text-green-600">✓ Salvato</span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-red-500">Errore: {saveError}</span>
          )}
          {saveStatus === "saving" && (
            <span className="text-sm text-brand-500">Salvataggio...</span>
          )}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="glass-button text-white font-medium px-5 py-2 rounded-xl text-sm disabled:opacity-50"
          >
            Salva modifiche
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-brand-200/50 p-4 hidden md:block">
          <nav className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setCurrentSection(s.key)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentSection === s.key
                    ? "bg-accent/15 text-accent"
                    : "text-brand-600 hover:text-brand-800 hover:bg-brand-100/50"
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
    "w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm";
  return (
    <div>
      <label className="block text-xs font-medium text-brand-600 mb-1">
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
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
        <label className="block text-xs font-medium text-brand-600 mb-1">
          Paragrafi (HTML supportato)
        </label>
        {a.paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <textarea
              className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
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
        ))}
        <button
          onClick={() => {
            const next = [...a.paragraphs, ""];
            update(["about", "paragraphs"], next);
          }}
          className="text-xs text-accent hover:underline"
        >
          + Aggiungi paragrafo
        </button>
      </div>
      <div>
        <label className="block text-xs font-medium text-brand-600 mb-1">
          Skill (etichetta ⬄ icona)
        </label>
        {a.skills.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input
              className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
              value={s.label}
              onChange={(e) => {
                const next = [...a.skills];
                next[i] = { ...next[i], label: e.target.value };
                update(["about", "skills"], next);
              }}
              placeholder="Etichetta"
            />
            <input
              className="w-16 px-2 py-2 rounded-lg glass-input text-brand-800 text-sm text-center"
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
          className="text-xs text-accent hover:underline"
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
        Servizi
      </h2>
      <InputField
        label="Titolo sezione"
        value={s.title}
        onChange={(v) => {
          /* use parent update via closure since we have services path */
        }}
      />
      <InputField
        label="Sottotitolo"
        value={s.subtitle}
        onChange={(v) => {
          /* need to access setContent differently */
        }}
        rows={2}
      />
      {s.items.map((item, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-brand-500 uppercase">
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
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
            value={item.title}
            onChange={(e) => updateArrItem(["services", "items"], i, "title", e.target.value)}
            placeholder="Titolo"
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
            value={item.description}
            onChange={(e) =>
              updateArrItem(["services", "items"], i, "description", e.target.value)
            }
            rows={2}
            placeholder="Descrizione"
          />
          <select
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
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
        className="text-xs text-accent hover:underline"
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
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
        <div key={i} className="glass-card rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-brand-500 uppercase">
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
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
            value={proj.title}
            onChange={(e) =>
              updateArrItem(["portfolio", "projects"], i, "title", e.target.value)
            }
            placeholder="Titolo"
          />
          <input
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
            value={proj.category}
            onChange={(e) =>
              updateArrItem(["portfolio", "projects"], i, "category", e.target.value)
            }
            placeholder="Categoria"
          />
          <input
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
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
        className="text-xs text-accent hover:underline"
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
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
      <h3 className="text-sm font-semibold text-brand-800 mt-6 mb-2">
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
        Navigazione
      </h2>
      {content.nav.map((link, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-brand-500 uppercase">
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
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
            value={link.label}
            onChange={(e) => updateArrItem(["nav"], i, "label", e.target.value)}
            placeholder="Etichetta"
          />
          <input
            className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
            value={link.href}
            onChange={(e) => updateArrItem(["nav"], i, "href", e.target.value)}
            placeholder="#sezione"
          />
        </div>
      ))}
      <button
        onClick={() => addArrItem(["nav"], { label: "", href: "#" })}
        className="text-xs text-accent hover:underline"
      >
        + Aggiungi link
      </button>
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
      <h2 className="font-serif text-xl font-semibold text-brand-900 mb-4">
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
        <label className="block text-xs font-medium text-brand-600 mb-1">
          Link footer
        </label>
        {f.footerLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="w-full px-3 py-2 rounded-lg glass-input text-brand-800 text-sm"
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
          className="text-xs text-accent hover:underline"
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

/* ── Utility: SHA-256 hash via Web Crypto API ── */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

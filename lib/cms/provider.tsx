"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CMS_STORAGE_KEY,
  CMS_VERSION,
  createDefaultContent,
  sanitizeContent,
  type CmsContent,
} from "@/lib/cms/content";

type CmsUpdater = (current: CmsContent) => CmsContent;

export type CmsImportResult =
  | { ok: true }
  | { ok: false; error: string };

type CmsContextValue = {
  content: CmsContent;
  ready: boolean;
  update: (updater: CmsUpdater) => void;
  resetContent: () => void;
  importContent: (json: string) => CmsImportResult;
  exportContent: () => string;
};

const CmsContext = createContext<CmsContextValue | null>(null);

function persist(content: CmsContent) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(content));
  } catch {
    // The content still applies for the current session.
  }
}

function readStoredContent(): CmsContent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return null;
    return sanitizeContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<CmsContent>(createDefaultContent);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredContent();
    if (stored) setContent(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CMS_STORAGE_KEY) return;
      if (!event.newValue) {
        setContent(createDefaultContent());
        return;
      }

      try {
        setContent(sanitizeContent(JSON.parse(event.newValue)));
      } catch {
        // Ignore malformed cross-tab payloads.
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((updater: CmsUpdater) => {
    setContent((current) => {
      const next = updater(current);
      const stamped: CmsContent = {
        ...next,
        version: CMS_VERSION,
        updatedAt: new Date().toISOString(),
      };
      persist(stamped);
      return stamped;
    });
  }, []);

  const resetContent = useCallback(() => {
    update(() => createDefaultContent());
  }, [update]);

  const importContent = useCallback(
    (json: string): CmsImportResult => {
      try {
        const parsed = JSON.parse(json);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          return { ok: false, error: "The file does not contain a content object." };
        }

        const next = sanitizeContent(parsed);
        update(() => next);
        return { ok: true };
      } catch {
        return { ok: false, error: "The file is not valid JSON." };
      }
    },
    [update],
  );

  const exportContent = useCallback(
    () => JSON.stringify(content, null, 2),
    [content],
  );

  const value = useMemo<CmsContextValue>(
    () => ({
      content,
      ready,
      update,
      resetContent,
      importContent,
      exportContent,
    }),
    [content, exportContent, importContent, ready, resetContent, update],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) throw new Error("useCms must be used within a CmsProvider");
  return context;
}

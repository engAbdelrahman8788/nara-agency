"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info";
type ToastItem = { id: number; title: string; description?: string; tone: ToastTone };

type ToastContextValue = {
  toast: (input: { title: string; description?: string; tone?: ToastTone }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, tone = "success" }: { title: string; description?: string; tone?: ToastTone }) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current.slice(-2), { id, title, description, tone }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="false"
            className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5"
          >
            {toasts.map((item) => (
              <div
                key={item.id}
                className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-[#101420]/95 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-fade-up"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    item.tone === "success" ? "bg-emerald-400/12 text-emerald-300" : "bg-electric/15 text-electric-soft",
                  )}
                >
                  {item.tone === "success" ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.84rem] font-semibold text-white">{item.title}</p>
                  {item.description && <p className="mt-0.5 text-xs leading-relaxed text-mist">{item.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

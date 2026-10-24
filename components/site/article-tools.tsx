"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, next)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[100] h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-electric via-electric-soft to-electric-pale transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function ArticleToc({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const sections = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page">
      <p className="text-[0.53rem] font-semibold uppercase tracking-[0.18em] text-white/42">On this page</p>
      <ul className="mt-4 space-y-1 border-l border-white/[0.08]">
        {headings.map((heading) => {
          const isActive = active === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 pl-4 text-[0.7rem] leading-5 transition-colors duration-200",
                  isActive
                    ? "border-electric-soft text-white/80"
                    : "border-transparent text-white/48 hover:border-white/25 hover:text-white/70",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ShareRow({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://nara.agency/insights/${slug}`;

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
      setCopied(true);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 hidden text-[0.53rem] uppercase tracking-[0.14em] text-white/42 sm:inline">Share</span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy article link"}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/48 transition hover:border-white/20 hover:text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/48 transition hover:border-white/20 hover:text-white"
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/48 transition hover:border-white/20 hover:text-white"
      >
        <Linkedin className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
  threshold?: number;
  as?: "div" | "section" | "article" | "span" | "li";
};

export function Reveal({ children, className, delay = 0, threshold = 0.12, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const Component = as;

  return (
    <Component
      ref={ref as never}
      className={cn("reveal", visible && "is-visible", delay > 0 && `reveal-delay-${delay}`, className)}
    >
      {children}
    </Component>
  );
}

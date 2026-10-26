"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/language-provider";
import { formatMessage } from "@/lib/i18n/translations";

type AvatarProps = {
  initials: string;
  name?: string;
  imageSrc?: string;
  className?: string;
  accent?: string;
  accentHex?: string;
  size?: "xs" | "sm" | "md" | "lg";
};

function hexGradient(hex: string | undefined): CSSProperties | undefined {
  if (!hex) return undefined;

  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return undefined;

  const value = Number.parseInt(match[1], 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const shade = (channel: number) => Math.round(channel * 0.45);

  return {
    backgroundImage: `linear-gradient(135deg, ${hex} 0%, rgb(${shade(red)}, ${shade(green)}, ${shade(blue)}) 100%)`,
  };
}

const sizes = {
  xs: "h-6 w-6 text-[0.55rem]",
  sm: "h-8 w-8 text-[0.65rem]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function Avatar({
  initials,
  name,
  imageSrc,
  className,
  accent = "from-[#2563EB] to-[#072465]",
  accentHex,
  size = "md",
}: AvatarProps) {
  return (
    <span
      role={name ? "img" : undefined}
      aria-label={name}
      style={hexGradient(accentHex)}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold tracking-[0.06em] text-white ring-1 ring-inset ring-white/15",
        sizes[size],
        accent,
        className,
      )}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          width={96}
          height={96}
          sizes="96px"
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}

type StarRatingProps = {
  rating?: number;
  className?: string;
  size?: number;
};

export function StarRating({ rating = 5, className, size = 14 }: StarRatingProps) {
  const { t } = useLanguage();

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={formatMessage(t.common.starRating, { rating })}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          width={size}
          height={size}
          fill={index < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          className={index < rating ? "text-[#FFC857]" : "text-white/42"}
          aria-hidden="true"
        >
          <path d="M10 1.75l2.43 4.92 5.43.79-3.93 3.83.93 5.4L10 14.14l-4.86 2.55.93-5.4L2.14 7.46l5.43-.79L10 1.75z" />
        </svg>
      ))}
    </span>
  );
}

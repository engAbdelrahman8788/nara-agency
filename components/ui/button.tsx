import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-white/10 bg-electric text-white shadow-[0_8px_30px_-10px_rgba(0,75,255,0.75)] hover:bg-electric-hover hover:shadow-[0_12px_36px_-10px_rgba(37,99,235,0.85)] active:translate-y-px",
  secondary:
    "border-white/10 bg-white/[0.045] text-white hover:border-white/20 hover:bg-white/[0.08] active:translate-y-px",
  ghost: "border-transparent bg-transparent text-mist hover:bg-white/[0.05] hover:text-white",
  light:
    "border-white bg-white text-[#08090d] hover:bg-[#e7eaf3] active:translate-y-px",
  outline:
    "border-electric/30 bg-electric/[0.06] text-electric-pale hover:border-electric/60 hover:bg-electric/[0.12] active:translate-y-px",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-lg px-3.5 text-[0.8rem]",
  md: "h-11 gap-2 rounded-[10px] px-5 text-[0.86rem]",
  lg: "h-[3.25rem] gap-2 rounded-xl px-6 text-[0.92rem]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "group/button inline-flex select-none items-center justify-center border font-semibold transition-all duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

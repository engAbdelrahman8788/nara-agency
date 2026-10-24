import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  markClassName?: string;
  priority?: boolean;
};

export function Logo({ className, markClassName = "h-11", priority = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/nara-monogram.png"
        alt=""
        width={720}
        height={472}
        sizes="96px"
        priority={priority}
        className={cn("w-auto object-contain", markClassName)}
      />
    </span>
  );
}

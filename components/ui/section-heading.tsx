import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "flex flex-col items-center")}>
        <SectionLabel>{eyebrow}</SectionLabel>
        <h2 className={cn("mt-5 text-display-md font-display font-medium text-gradient-white text-balance", titleClassName)}>
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-xl text-[0.95rem] leading-7 text-mist text-pretty">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

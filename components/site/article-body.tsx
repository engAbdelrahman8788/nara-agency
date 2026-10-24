import { ArrowUpRight, Sparkles } from "lucide-react";
import type { ArticleBlock } from "@/lib/insights-content";
import { cn } from "@/lib/utils";

function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <aside className="relative overflow-hidden rounded-xl border border-electric/18 bg-electric/[0.045] p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-electric/15 blur-3xl" />
      <div className="relative flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-electric-pale" />
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-electric-pale/85">Key takeaways</p>
      </div>
      <ul className="relative mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 text-[0.8rem] leading-6 text-white/62">
            <span className="mt-0.5 font-display text-[0.62rem] font-semibold text-electric-pale/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function StatBlock({ items }: { items: { value: string; label: string; detail: string }[] }) {
  return (
    <div className="my-9 grid overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B0E16] sm:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "p-5",
            index > 0 && "border-t border-white/[0.07] sm:border-l sm:border-t-0",
          )}
        >
          <p className="font-display text-[1.9rem] font-medium leading-none tracking-[-0.04em] text-gradient-blue">
            {item.value}
          </p>
          <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/62">{item.label}</p>
          <p className="mt-2 text-[0.66rem] leading-5 text-white/42">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

function ArticleBlockView({ block, index }: { block: ArticleBlock; index: number }) {
  switch (block.type) {
    case "heading":
      return (
        <div id={block.id} className="mt-14 scroll-mt-32 first:mt-0">
          <span className="mb-3 block h-px w-8 bg-gradient-to-r from-electric-soft to-transparent" />
          <h2 className="font-display text-[1.55rem] font-medium leading-snug tracking-[-0.025em] text-white sm:text-[1.8rem]">
            {block.text}
          </h2>
        </div>
      );
    case "paragraph":
      return (
        <p className="mt-5 text-[0.94rem] leading-[1.95] text-white/62 first:mt-0 sm:text-[0.98rem]">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[0.9rem] leading-7 text-white/62">
              <span className="mt-[0.68rem] h-1 w-1 shrink-0 rounded-full bg-electric-soft shadow-[0_0_8px_rgba(77,125,255,0.6)]" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <figure className="relative my-10 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-electric via-electric/30 to-transparent" />
          <span aria-hidden="true" className="font-display text-4xl leading-none text-electric-soft/45">&ldquo;</span>
          <blockquote className="mt-1 font-display text-[1.2rem] font-medium leading-[1.55] tracking-[-0.015em] text-white/82 sm:text-[1.35rem]">
            {block.quote}
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-2.5">
            <span className="h-px w-6 bg-white/15" />
            <span className="text-[0.66rem] font-semibold text-white/62">{block.attribution}</span>
            <span className="text-[0.62rem] text-white/42">{block.role}</span>
          </figcaption>
        </figure>
      );
    case "stats":
      return <StatBlock items={block.items} />;
    case "callout":
      return (
        <aside className="relative my-9 overflow-hidden rounded-xl border border-white/[0.09] bg-[linear-gradient(135deg,rgba(0,75,255,0.09),rgba(15,18,28,0.6))] p-5 sm:p-6">
          <div className="absolute inset-y-0 left-0 w-0.5 bg-electric-soft" />
          <p className="text-[0.53rem] font-semibold uppercase tracking-[0.2em] text-electric-pale/65">{block.label}</p>
          <p className="mt-2 font-display text-[1rem] font-medium tracking-[-0.01em] text-white/85">{block.title}</p>
          <p className="mt-2 text-[0.8rem] leading-6 text-white/48">{block.text}</p>
        </aside>
      );
    default:
      return null;
  }
}

export function ArticleBody({ blocks, takeaways }: { blocks: ArticleBlock[]; takeaways: string[] }) {
  return (
    <div>
      <KeyTakeaways items={takeaways} />

      <div className="mt-12">
        {blocks.map((block, index) => (
          <div key={block.type === "heading" ? block.id : `${block.type}-${index}`} className={block.type === "heading" ? "" : "contents"}>
            <ArticleBlockView block={block} index={index} />
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-white/[0.018] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-white/42">Put the thinking to work</p>
          <p className="mt-1.5 font-display text-[1rem] font-medium tracking-[-0.01em] text-white/82">
            Want this applied to your account?
          </p>
        </div>
        <a
          href="/#contact"
          className="group inline-flex items-center gap-2 text-[0.76rem] font-semibold text-electric-pale transition hover:text-white"
        >
          Book a strategy call
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

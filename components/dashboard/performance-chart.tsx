"use client";

import { useId, useMemo, useState } from "react";
import { ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react";
import { chartRanges, performanceData } from "@/lib/data";
import type { ChartRange } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

const width = 760;
const height = 264;
const margin = { top: 20, right: 18, bottom: 34, left: 44 };

type Point = { x: number; y: number };

function buildSmoothPath(points: Point[]) {
  return points.reduce((path, point, index, all) => {
    if (index === 0) return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    const previous = all[index - 1];
    const beforePrevious = all[index - 2] ?? previous;
    const next = all[index + 1] ?? point;
    const cp1x = previous.x + (point.x - beforePrevious.x) / 6;
    const cp1y = previous.y + (point.y - beforePrevious.y) / 6;
    const cp2x = point.x - (next.x - previous.x) / 6;
    const cp2y = point.y - (next.y - previous.y) / 6;
    return `${path} C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, "");
}

function niceStep(max: number, targetTicks = 5) {
  const rough = max / targetTicks;
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(rough, 1)));
  const normalized = rough / magnitude;
  const choices = [1, 2, 2.5, 3, 4, 5, 7.5, 10];
  const factor = choices.find((choice) => choice >= normalized) ?? 10;
  return factor * magnitude;
}

export function PerformanceChart() {
  const [range, setRange] = useState<ChartRange>("30D");
  const [hovered, setHovered] = useState<number | null>(null);
  const gradientId = useId().replace(/:/g, "");
  const data = performanceData[range];

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, point) => ({
          revenue: acc.revenue + point.revenue,
          spend: acc.spend + point.spend,
        }),
        { revenue: 0, spend: 0 },
      ),
    [data],
  );

  const roas = totals.revenue / totals.spend;
  const maxRevenue = Math.max(...data.map((point) => point.revenue));
  const step = niceStep(maxRevenue);
  const yMax = Math.ceil(maxRevenue / step) * step;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const ticks = Array.from({ length: Math.round(yMax / step) + 1 }, (_, index) => index * step);

  const points = data.map((point, index) => ({
    x: margin.left + (index / (data.length - 1)) * plotWidth,
    y: margin.top + plotHeight - (point.revenue / yMax) * plotHeight,
    spendY: margin.top + plotHeight - (point.spend / yMax) * plotHeight,
    data: point,
  }));

  const revenuePath = buildSmoothPath(points);
  const spendPath = buildSmoothPath(points.map((point) => ({ ...point, y: point.spendY })));
  const areaPath = `${revenuePath} L ${points[points.length - 1].x.toFixed(2)} ${margin.top + plotHeight} L ${points[0].x.toFixed(2)} ${margin.top + plotHeight} Z`;
  const labelStride = data.length > 8 ? Math.ceil(data.length / 6) : 1;
  const hoveredPoint = hovered !== null ? points[hovered] : null;

  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - bounds.left) / bounds.width;
    const viewX = xRatio * width;
    if (viewX < margin.left - 12 || viewX > width - margin.right + 12) {
      setHovered(null);
      return;
    }
    const index = Math.round(((viewX - margin.left) / plotWidth) * (data.length - 1));
    setHovered(Math.max(0, Math.min(data.length - 1, index)));
  };

  return (
    <div className="rounded-xl border border-white/[0.075] bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
      <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-white">Performance overview</h2>
            <span className="flex items-center gap-1.5 rounded border border-emerald-400/15 bg-emerald-400/[0.06] px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-emerald-300">
              <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <p className="mt-1 text-[0.8rem] text-white/48">Attributed revenue and media spend</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/15 p-1" role="group" aria-label="Chart date range">
          {chartRanges.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setRange(option);
                setHovered(null);
              }}
              aria-pressed={range === option}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[0.75rem] font-semibold transition-all duration-200",
                range === option ? "bg-white/[0.09] text-white shadow-sm" : "text-white/48 hover:text-white/70",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-white/48">Attributed revenue</p>
            <div className="mt-1.5 flex items-end gap-2.5">
              <p className="font-display text-[1.85rem] font-medium leading-none tracking-[-0.035em] text-white sm:text-[2.2rem]">
                {formatCurrency(totals.revenue * 1000, { compact: true })}
              </p>
              <span className="mb-1 inline-flex items-center gap-1 rounded-md bg-emerald-400/[0.08] px-1.5 py-0.5 text-[0.7rem] font-semibold text-emerald-300">
                <TrendingUp className="h-2.5 w-2.5" />
                +18.6%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 pr-1 text-right">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/48">Media spend</p>
              <p className="mt-1 font-display text-sm font-medium text-white/78">
                {formatCurrency(totals.spend * 1000, { compact: true })}
              </p>
            </div>
            <span className="h-7 w-px bg-white/10" />
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/48">Blended ROAS</p>
              <p className="mt-1 font-display text-sm font-medium text-white/78">{roas.toFixed(2)}x</p>
            </div>
            <span className="hidden h-7 w-px bg-white/10 sm:block" />
            <div className="hidden sm:block">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/48">vs. target</p>
              <p className="mt-1 inline-flex items-center gap-1 font-display text-sm font-medium text-emerald-300">
                <ArrowUpRight className="h-3 w-3" />
                112%
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full touch-pan-y select-none"
            role="img"
            aria-label={`Revenue and media spend chart over ${range}. Attributed revenue ${formatCurrency(totals.revenue * 1000)} and media spend ${formatCurrency(totals.spend * 1000)}.`}
            onMouseMove={handleMove}
            onMouseLeave={() => setHovered(null)}
          >
            <defs>
              <linearGradient id={`area-${gradientId}`} x1="0" y1={margin.top} x2="0" y2={height - margin.bottom} gradientUnits="userSpaceOnUse">
                <stop stopColor="#004BFF" stopOpacity="0.3" />
                <stop offset="0.65" stopColor="#004BFF" stopOpacity="0.07" />
                <stop offset="1" stopColor="#004BFF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`line-${gradientId}`} x1={margin.left} y1="0" x2={width - margin.right} y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="0.6" stopColor="#6C96FF" />
                <stop offset="1" stopColor="#C3D3FF" />
              </linearGradient>
            </defs>

            {ticks.map((tick) => {
              const y = margin.top + plotHeight - (tick / yMax) * plotHeight;
              return (
                <g key={tick}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={width - margin.right}
                    y2={y}
                    stroke="rgba(255,255,255,0.055)"
                    strokeDasharray="3 6"
                  />
                  <text x={margin.left - 10} y={y + 3.5} textAnchor="end" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="var(--font-manrope)">
                    ${tick}k
                  </text>
                </g>
              );
            })}

            {points.map((point, index) => {
              if (index !== 0 && index !== data.length - 1 && index % labelStride !== 0) return null;
              return (
                <text
                  key={`label-${point.data.label}`}
                  x={point.x}
                  y={height - 10}
                  textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
                  fill="rgba(255,255,255,0.22)"
                  fontSize="9"
                  fontFamily="var(--font-manrope)"
                >
                  {point.data.label}
                </text>
              );
            })}

            <path d={areaPath} fill={`url(#area-${gradientId})`} />
            <path
              key={`spend-${range}`}
              d={spendPath}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
              strokeDasharray="4 5"
              strokeLinecap="round"
            />
            <path
              key={`revenue-${range}`}
              d={revenuePath}
              fill="none"
              stroke={`url(#line-${gradientId})`}
              strokeWidth="2.2"
              strokeLinecap="round"
              className="chart-line"
            />

            {hoveredPoint && (
              <g>
                <line
                  x1={hoveredPoint.x}
                  y1={margin.top}
                  x2={hoveredPoint.x}
                  y2={margin.top + plotHeight}
                  stroke="rgba(255,255,255,0.16)"
                  strokeDasharray="3 4"
                />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.spendY} r="3" fill="#0F121C" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="8" fill="#004BFF" fillOpacity="0.16" />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="3.5" fill="#FFFFFF" stroke="#004BFF" strokeWidth="2" />
              </g>
            )}

            <rect
              x={margin.left}
              y={margin.top}
              width={plotWidth}
              height={plotHeight}
              fill="transparent"
            />
          </svg>

          {hoveredPoint && (
            <div
              className="pointer-events-none absolute z-10 w-[9.5rem] -translate-x-1/2 rounded-lg border border-white/10 bg-[#0A0D15]/95 p-2.5 shadow-xl backdrop-blur-md"
              style={{
                left: `${Math.min(88, Math.max(12, (hoveredPoint.x / width) * 100))}%`,
                top: `${Math.max(2, (hoveredPoint.y / height) * 100 - 10)}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.1em] text-white/48">{hoveredPoint.data.label}</p>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between gap-3 text-[0.7rem]">
                  <span className="flex items-center gap-1.5 text-white/48">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric-soft" />
                    Revenue
                  </span>
                  <span className="font-semibold text-white">${hoveredPoint.data.revenue}k</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-[0.7rem]">
                  <span className="flex items-center gap-1.5 text-white/48">
                    <span className="h-1.5 w-1.5 rounded-full border border-white/30" />
                    Spend
                  </span>
                  <span className="font-semibold text-white/70">${hoveredPoint.data.spend}k</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-1 text-[0.7rem]">
                  <span className="text-white/48">ROAS</span>
                  <span className="font-semibold text-emerald-300">{(hoveredPoint.data.revenue / hoveredPoint.data.spend).toFixed(2)}x</span>
                </div>
              </div>
            </div>
          )}

          <table className="sr-only">
            <caption>Performance by date</caption>
            <thead>
              <tr><th>Date</th><th>Revenue</th><th>Spend</th></tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.label}>
                  <td>{point.label}</td>
                  <td>${point.revenue}k</td>
                  <td>${point.spend}k</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.055] pt-3.5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[0.7rem] text-white/48">
              <span className="h-1.5 w-4 rounded-full bg-gradient-to-r from-electric to-electric-soft" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-[0.7rem] text-white/48">
              <span className="h-px w-4 border-t border-dashed border-white/35" />
              Media spend
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[0.7rem] text-white/48">
            <RefreshCw className="h-2.5 w-2.5" />
            Synced 2 min ago
          </span>
        </div>
      </div>
    </div>
  );
}

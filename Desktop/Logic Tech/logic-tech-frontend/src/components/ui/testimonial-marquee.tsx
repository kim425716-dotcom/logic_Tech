"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  name: string;
  text: string;
  avatar: string;
  role?: string;
  username?: string;
  profileLink?: string;
}

export interface TestimonialMarqueeProps {
  items: Testimonial[];
  variant?: "default" | "stacked" | "dual" | "flush" | "flush-dual";
  className?: string;
  speed?: number;
  containerClassName?: string;
}

const MarqueeStyles = React.memo(() => (
  <style>{`
    @keyframes marquee-left {
      from { transform: translate3d(0, 0, 0); }
      to   { transform: translate3d(-100%, 0, 0); }
    }
    @keyframes marquee-right {
      from { transform: translate3d(-100%, 0, 0); }
      to   { transform: translate3d(0, 0, 0); }
    }
    .animate-marquee-left  { animation: marquee-left  var(--duration) linear infinite; }
    .animate-marquee-right { animation: marquee-right var(--duration) linear infinite; }
  `}</style>
));
MarqueeStyles.displayName = "MarqueeStyles";

const MarqueeRow = React.memo(
  ({
    children,
    direction = "left",
    speed = 40,
    className,
    pauseOnHover = true,
  }: {
    children: React.ReactNode;
    direction?: "left" | "right";
    speed?: number;
    className?: string;
    pauseOnHover?: boolean;
  }) => (
    <div className={cn("group flex overflow-hidden p-2 [--gap:1rem]", className)}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1 ? true : undefined}
          className={cn(
            "flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]",
            direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          {children}
        </div>
      ))}
    </div>
  ),
);
MarqueeRow.displayName = "MarqueeRow";

const TestimonialCard = React.memo(
  ({ item, variant = "default" }: { item: Testimonial; variant?: "default" | "flush" }) => {
    const isFlush = variant === "flush";
    return (
      <div
        className={cn(
          "relative group flex h-auto w-[320px] shrink-0 flex-col justify-between overflow-hidden p-6 transition-all transform-gpu [backface-visibility:hidden]",
          isFlush
            ? "rounded-none border-r border-white/10 bg-white/5 hover:bg-white/10"
            : "rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative z-10 flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-slate-300 line-clamp-4">
            &quot;{item.text}&quot;
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20">
              <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" loading="eager" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{item.name}</span>
              {item.role && <span className="text-xs text-slate-400">{item.role}</span>}
              {item.username && !item.role && (
                <span className="text-xs text-slate-400">@{item.username}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
TestimonialCard.displayName = "TestimonialCard";

export function TestimonialMarquee({
  items,
  variant = "default",
  className,
  speed = 30,
  containerClassName,
}: TestimonialMarqueeProps) {
  const cnContainer = cn(containerClassName, className);

  const itemsToDisplay = React.useMemo(() => {
    let result = [...items];
    while (result.length < 10) result = [...result, ...items];
    return result;
  }, [items]);

  const half = Math.ceil(itemsToDisplay.length / 2);

  if (variant === "dual") {
    return (
      <>
        <MarqueeStyles />
        <div className={cn("flex flex-col gap-4 py-8 overflow-hidden", containerClassName)}>
          <MarqueeRow speed={speed} direction="left">
            {itemsToDisplay.slice(0, half).map((item, i) => (
              <TestimonialCard key={`r1-${i}`} item={item} />
            ))}
          </MarqueeRow>
          <MarqueeRow speed={speed} direction="right">
            {itemsToDisplay.slice(half).map((item, i) => (
              <TestimonialCard key={`r2-${i}`} item={item} />
            ))}
          </MarqueeRow>
        </div>
      </>
    );
  }

  if (variant === "flush" || variant === "flush-dual") {
    return (
      <>
        <MarqueeStyles />
        <div className={cn("flex flex-col overflow-hidden border-y border-white/10 relative", cnContainer)}>
          <MarqueeRow speed={speed} direction="left" className="[--gap:0rem] p-0 border-b border-white/10">
            {itemsToDisplay.slice(0, half).map((item, i) => (
              <TestimonialCard key={`fd1-${i}`} item={item} variant="flush" />
            ))}
          </MarqueeRow>
          {variant === "flush-dual" && (
            <MarqueeRow speed={speed} direction="right" className="[--gap:0rem] p-0">
              {itemsToDisplay.slice(half).map((item, i) => (
                <TestimonialCard key={`fd2-${i}`} item={item} variant="flush" />
              ))}
            </MarqueeRow>
          )}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-950 to-transparent z-10" />
        </div>
      </>
    );
  }

  // default
  return (
    <>
      <MarqueeStyles />
      <div className={cn("py-8 overflow-hidden", cnContainer)}>
        <MarqueeRow speed={speed} direction="left">
          {itemsToDisplay.map((item, i) => (
            <TestimonialCard key={`d-${i}`} item={item} />
          ))}
        </MarqueeRow>
      </div>
    </>
  );
}

export default TestimonialMarquee;

interface LiveIndicatorProps {
  live?: boolean;
  intervalLabel?: string;
}

export default function LiveIndicator({ live, intervalLabel = '5s' }: LiveIndicatorProps) {
  if (!live) return null;

  return (
    <span className="text-xs px-2.5 py-1 rounded-full border text-emerald-400 border-emerald-500/30 bg-emerald-500/10 whitespace-nowrap">
      Live · refreshes every {intervalLabel}
    </span>
  );
}

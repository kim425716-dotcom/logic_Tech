

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
  title?: string;
}

export function BarChart({ data, height = 120, showValues = true, title }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="w-full">
      {title && <p className="text-sm font-semibold text-slate-300 mb-3">{title}</p>}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 flex-1">
            {showValues && (
              <span className="text-xs text-slate-400">{item.value}</span>
            )}
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{
                height: `${(item.value / max) * (height - 30)}px`,
                background: item.color || 'linear-gradient(to top, #7c3aed, #4f46e5)',
              }}
            />
            <span className="text-xs text-slate-500 text-center truncate w-full">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ segments, size = 120, thickness = 24, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map(seg => {
    const dash = (seg.value / total) * circumference;
    const arc = { dash, offset, color: seg.color, label: seg.label, value: seg.value };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <p className="text-lg font-bold text-white">{centerValue}</p>}
            {centerLabel && <p className="text-xs text-slate-400">{centerLabel}</p>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-slate-400">{seg.label}</span>
            <span className="text-xs font-semibold text-slate-300 ml-auto">{((seg.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

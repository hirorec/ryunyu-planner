interface ProgressRingProps {
  done: number
  total: number
  size?: number
  strokeWidth?: number
}

export function ProgressRing({
  done,
  total,
  size = 64,
  strokeWidth = 6,
}: ProgressRingProps) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? done / total : 0
  const offset = circ * (1 - pct)

  return (
    <svg width={size} height={size} className="shrink-0">
      {/* 背景リング */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#E0E0E0" strokeWidth={strokeWidth}
      />
      {/* 進捗リング */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#66BB6A" strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-500"
      />
      {/* テキスト */}
      <text
        x={size / 2} y={size / 2 - 4}
        textAnchor="middle" dominantBaseline="middle"
        className="text-xs font-bold fill-brand-dark"
        fontSize={12}
      >
        {done}
      </text>
      <text
        x={size / 2} y={size / 2 + 8}
        textAnchor="middle" dominantBaseline="middle"
        className="fill-gray-400"
        fontSize={9}
      >
        /{total}
      </text>
    </svg>
  )
}

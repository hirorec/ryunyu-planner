'use client'

const DAYS = ['月','火','水','木','金','土','日'] as const

interface DaySelectorProps {
  selected: number
  onSelect: (idx: number) => void
  todayIdx?: number
}

export function DaySelector({ selected, onSelect, todayIdx = 0 }: DaySelectorProps) {
  return (
    <div className="flex gap-1.5 px-4 py-3">
      {DAYS.map((day, i) => {
        const active = i === selected
        return (
          <button
            key={day}
            onClick={() => onSelect(i)}
            className={`flex-1 flex flex-col items-center py-2 rounded-xl
                        text-xs font-medium transition-all duration-150
                        ${active
                          ? 'bg-brand-light text-white font-bold shadow-sm'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
          >
            <span>{day}</span>
            {i === todayIdx && (
              <span className={`text-[9px] mt-0.5 ${active ? 'text-green-100' : 'text-brand-light'}`}>
                今日
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

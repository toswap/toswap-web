import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

interface Props {
  seconds: number
  onComplete: () => void
  label?: string
  variant?: 'prep' | 'record'
}

export default function CountdownTimer({ seconds, onComplete, label, variant = 'prep' }: Props) {
  const [remaining, setRemaining] = useState(seconds)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) {
      onCompleteRef.current()
      return
    }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining])

  const radius = 44
  const circumference = 2 * Math.PI * radius
  const progress = remaining / seconds
  const dashOffset = circumference * (1 - progress)

  const isUrgent = remaining <= 5

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className={clsx(
          'text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full',
          variant === 'record'
            ? 'bg-red-100 text-red-600'
            : 'bg-indigo-100 text-indigo-600'
        )}>
          {label}
        </span>
      )}
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={variant === 'record' ? '#ef4444' : '#6366f1'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx(
            'text-3xl font-bold tabular-nums',
            isUrgent ? 'text-red-500 animate-pulse' : 'text-gray-800'
          )}>
            {remaining}
          </span>
          <span className="text-xs text-gray-400">초</span>
        </div>
      </div>
    </div>
  )
}

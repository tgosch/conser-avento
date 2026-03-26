interface Props {
  className?: string
  variant?: 'text' | 'card' | 'circle' | 'table-row'
  count?: number
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} style={{ height: 14 }} />
}

export function Skeleton({ className = '', variant = 'text', count = 1 }: Props) {
  if (variant === 'circle') {
    return <div className={`skeleton rounded-full ${className}`} style={{ width: 40, height: 40 }} />
  }

  if (variant === 'card') {
    return (
      <div className={`card p-5 flex flex-col gap-3 ${className}`}>
        <SkeletonLine className="w-2/3" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-1/2" />
      </div>
    )
  }

  if (variant === 'table-row') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <SkeletonLine className="w-32" />
            <SkeletonLine className="w-48" />
            <SkeletonLine className="w-24" />
            <SkeletonLine className="w-16" />
          </div>
        ))}
      </>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} className={i === count - 1 ? 'w-2/3' : 'w-full'} />
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <div className="skeleton h-28" style={{ borderRadius: 0 }} />
          <div className="p-3.5 flex flex-col gap-2">
            <SkeletonLine className="w-3/4" />
            <SkeletonLine className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

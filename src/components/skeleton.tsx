import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  animate?: boolean
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'rounded-md bg-zinc-200 dark:bg-zinc-800',
        animate && 'animate-pulse',
        className
      )}
    />
  )
}

export function SkeletonText({ 
  lines = 1, 
  className = '',
  animate = true 
}: { 
  lines?: number
  className?: string
  animate?: boolean
}) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            'h-4',
            i === lines - 1 && lines > 1 && 'w-3/4'
          )}
          animate={animate}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={clsx('rounded-lg border border-zinc-950/10 dark:border-white/10 p-4', className)}>
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="mt-1">
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
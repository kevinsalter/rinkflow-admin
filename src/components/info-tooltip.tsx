'use client'

import { useState, useRef, useEffect } from 'react'

interface InfoTooltipProps {
  content: string
  className?: string
  children?: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function InfoTooltip({ content, className = '', children, position = 'top' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleShow = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(true)
    setIsAnimating(true)
  }

  const handleHide = () => {
    setIsAnimating(false)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 200) // Match animation duration
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="relative inline-flex items-center">
      {children ? (
        <div
          onMouseEnter={handleShow}
          onMouseLeave={handleHide}
          className="inline-flex"
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          className={`group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-300/50 dark:bg-zinc-500/30 transition-all hover:bg-zinc-300/70 dark:hover:bg-zinc-500/50 ${className}`}
          onMouseEnter={handleShow}
          onMouseLeave={handleHide}
          onClick={() => isVisible ? handleHide() : handleShow()}
          aria-label="More information"
        >
          <span className="text-[10px] font-medium italic text-zinc-600 dark:text-zinc-200 transition-colors">
            i
          </span>
        </button>
      )}
      
      {isVisible && (
        <>
          {/* Backdrop for mobile to close on tap outside */}
          <div 
            className="fixed inset-0 z-10 lg:hidden" 
            onClick={handleHide}
          />
          
          {/* Tooltip with smooth animation */}
          <div className={`pointer-events-none absolute z-20 ${
            position === 'left' 
              ? 'right-full top-1/2 mr-2 -translate-y-1/2' 
              : position === 'bottom'
              ? 'top-full left-1/2 mt-2 -translate-x-1/2'
              : 'bottom-full left-1/2 mb-2 -translate-x-1/2'
          }`}>
            <div 
              className={`
                pointer-events-auto relative rounded-xl bg-white/95 backdrop-blur-xl
                px-4 py-2.5 shadow-2xl ring-1 ring-black/5
                dark:bg-zinc-900/95 dark:ring-white/10
                transition-all duration-200 ease-out
                ${isAnimating 
                  ? position === 'left' ? 'opacity-100 scale-100' : 'translate-y-0 opacity-100 scale-100'
                  : position === 'left' ? 'opacity-0 scale-95' : 'translate-y-1 opacity-0 scale-95'
                }
              `}
              style={{ 
                minWidth: position === 'left' ? 'auto' : '200px', 
                maxWidth: position === 'left' ? 'none' : '280px',
                whiteSpace: position === 'left' ? 'nowrap' : 'normal'
              }}
            >
              <p className="text-xs font-normal leading-relaxed text-zinc-600 dark:text-zinc-400">
                {content}
              </p>
              
              {/* Subtle arrow */}
              {position === 'top' && (
                <svg 
                  className={`
                    absolute left-1/2 top-full -ml-1 -mt-px h-2 w-2
                    text-white dark:text-zinc-900
                    transition-all duration-200 ease-out
                    ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-0.5 opacity-0'}
                  `}
                  viewBox="0 0 8 4"
                >
                  <path 
                    d="M4 4L0 0h8z" 
                    fill="currentColor"
                    fillOpacity="0.95"
                  />
                </svg>
              )}
              {position === 'bottom' && (
                <svg 
                  className={`
                    absolute left-1/2 bottom-full -ml-1 -mb-px h-2 w-2
                    text-white dark:text-zinc-900
                    transition-all duration-200 ease-out
                    ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-0.5 opacity-0'}
                  `}
                  viewBox="0 0 8 4"
                >
                  <path 
                    d="M4 0L8 4H0z" 
                    fill="currentColor"
                    fillOpacity="0.95"
                  />
                </svg>
              )}
              {position === 'left' && (
                <svg 
                  className={`
                    absolute -right-2 top-1/2 -translate-y-1/2 h-2 w-2
                    text-white dark:text-zinc-900
                    transition-all duration-200 ease-out
                    ${isAnimating ? 'opacity-100' : 'opacity-0'}
                  `}
                  viewBox="0 0 8 8"
                >
                  <path 
                    d="M0 4L8 0v8z" 
                    fill="currentColor"
                    fillOpacity="0.95"
                  />
                </svg>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
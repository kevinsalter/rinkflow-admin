export function Logo({ className = '', ...props }: React.ComponentPropsWithoutRef<'span'>) {
  // If no color class is provided, use the blue color
  const hasColorClass = className.includes('text-') || className.includes('dark:text-')
  
  return (
    <span 
      {...props} 
      className={`font-black text-3xl ${className}`}
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        letterSpacing: '-0.03em',
        ...(hasColorClass ? {} : { color: '#00B4D8' })
      }}
    >
      Rinkflow
    </span>
  )
}